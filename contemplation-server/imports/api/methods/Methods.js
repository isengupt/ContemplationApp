import { Meteor } from "meteor/meteor";
import { Coordinates } from "../schema/Coordinates";
import { Books } from "../schema/Books";
import { Profiles } from "../schema/Profiles";

const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-node");
const fetch = require("node-fetch");
const axios = require("axios");
var distanceLimit = 10000;

function getDistanceFromLatLng(lat1, lng1, lat2, lng2) {
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  function square(x) {
    return Math.pow(x, 2);
  }
  var r = 6371; // radius of the earth in km
  lat1 = deg2rad(lat1);
  lat2 = deg2rad(lat2);
  var lat_dif = lat2 - lat1;
  var lng_dif = deg2rad(lng2 - lng1);
  var a =
    square(Math.sin(lat_dif / 2)) +
    Math.cos(lat1) * Math.cos(lat2) * square(Math.sin(lng_dif / 2));
  var d = 2 * r * Math.asin(Math.sqrt(a));

  return d; //return km
}
const getMetaData = async () => {
  const metadata = await fetch(
    "https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json"
  );
  return metadata.json();
};

const padSequences = (sequences, metadata) => {
  //
  return sequences.map((seq) => {
    if (seq.length > metadata.max_len) {
      seq.splice(0, seq.length - metadata.max_len);
    }
    if (seq.length < metadata.max_len) {
      const pad = [];
      for (let i = 0; i < metadata.max_len - seq.length; ++i) {
        pad.push(0);
      }

      seq = pad.concat(seq);
    }

    return seq;
  });
};
const loadModel = async () => {
  const url = `https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json`;
  const model = await tf.loadLayersModel(url);
  return model;
};

const predict = (text, model, metadata) => {
  const trimmed = text
    .trim()
    .toLowerCase()
    .replace(/(\.|\,|\!)/g, "")
    .split(" ");
  const sequence = trimmed.map((word) => {
    const wordIndex = metadata.word_index[word];
    if (typeof wordIndex === "undefined") {
      return 2; //oov_index
    }
    return wordIndex + metadata.index_from;
  });

  const paddedSequence = padSequences([sequence], metadata);
  const input = tf.tensor2d(paddedSequence, [1, metadata.max_len]);

  const predictOut = model.predict(input);
  const score = predictOut.dataSync()[0];
  predictOut.dispose();
  return score;
};

const getSentiment = (score) => {
  if (score > 0.66) {
    return `Score of ${score} is Positive`;
  } else if (score > 0.4) {
    return `Score of ${score} is Neutral`;
  } else {
    return `Score of ${score} is Negative`;
  }
};

const run = async (text) => {
  const model = await loadModel();
  const metadata = await getMetaData();
  let sum = 0;
  text.forEach(function (prediction) {
    perc = predict(prediction, model, metadata);
    sum += parseFloat(perc, 10);
  });

  return sum / text.length;
};

function AddtoAverage(prevAvg, numValues, newValue) {
  return (prevAvg * numValues + newValue) / (numValues + 1);
}

function updateCoordinate(coordinateId, bookSentiment) {
  if (Coordinates.findOne({ _id: coordinateId }).timePoints.length == 0) {
    Coordinates.update(
      { _id: coordinateId },
      {
        $push: {
          timePoints: { score: bookSentiment, timeCalculated: Date.now() },
        },
      }
    );
    return bookSentiment;
  } else {
    const points = Coordinates.findOne({ _id: coordinateId }).timePoints;
    const prevSentiment = points[points.length - 1].score;
    const newSentiment = AddtoAverage(
      prevSentiment,
      points.length,
      bookSentiment
    );
    Coordinates.update(
      { _id: coordinateId },
      {
        $push: {
          timePoints: { score: newSentiment, timeCalculated: Date.now() },
        },
      }
    );
    return newSentiment;
  }
}

function updateBook(_id, data) {
  if (Books.findOne({ _id: _id }).timePoints.length == 0) {
    Books.update(
      { _id: _id },
      {
        $push: {
          timePoints: { score: data["score"], timeCalculated: Date.now() },
        },
      }
    );
    return updateCoordinate(
      Books.findOne({ _id: _id }).coordinateId,
      data["score"]
    );
  } else {
    const points = Books.findOne({ _id: _id }).timePoints;
    const prevSentiment = points[points.length - 1].score;
    const newSentiment = AddtoAverage(
      prevSentiment,
      points.length,
      data["score"]
    );
    Books.update(
      { _id: _id },
      {
        $push: {
          timePoints: { score: newSentiment, timeCalculated: Date.now() },
        },
      }
    );
    return updateCoordinate(
      Books.findOne({ _id: _id }).coordinateId,
      newSentiment
    );
  }
}

Meteor.methods({
  getCoordinates: function () {
    let coordinatesData = Coordinates.find({}).fetch();

    return coordinatesData;
  },
  createPortalAtCoordinates: function (pointInfo, currPosition) {
    if ("mapId" in pointInfo) {
      var distanceBetweenPoints =
        getDistanceFromLatLng(
          currPosition.latitude,
          currPosition.longitude,
          pointInfo.latitude,
          pointInfo.longitude
        ) * 1000;
      if (distanceBetweenPoints > distanceLimit) {
        return {
          distance: distanceBetweenPoints - distanceLimit,
          heading: "Error",
          message: "You are too far from the point",
        };
      } else {
        console.log(pointInfo._id)
        return pointInfo._id;
      }
    } else {
      const data = {
        title: pointInfo.display_name,
        latitude: pointInfo.lat,
        longitude: pointInfo.lon,
        mapId: pointInfo.place_id,
      };

      var distanceBetweenPoints =
        getDistanceFromLatLng(
          currPosition.latitude,
          currPosition.longitude,
          pointInfo.lat,
          pointInfo.lon
        ) * 1000;
      if (distanceBetweenPoints > distanceLimit) {
        return {
          distance: distanceBetweenPoints - distanceLimit,
          heading: "Error",
          message: "You are too far from the point",
        };
      } else {
        Coordinates.insert(data);
        console.log("Creating portal");

        return Coordinates.findOne({mapId: pointInfo.place_id})._id;
      }
    }
  },
  getBooks: function (_id) {
    return Books.findOne({ _id: _id });
  },
  createProfile: function (email) {
    const data = {
      name: email,
      userId: this.userId,
    };
    Profiles.insert(data);
    return this.userId;
  },
  getBooksAtLocation: function (_id) {
  Books.find({ coordinateId: _id }).fetch().map((item) => {
      console.log(item.datePosted) 

      const diffTime = Math.abs(Date.now() - item.datePosted)

      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays > 14) {
        Books.update(
          { _id: item.coordinateId },
          { $set: { status: "Archived" } }
        );
      }

    })

    //const diffTime = Math.abs(date2 - Data);
    //const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    return Books.find({ coordinateId: _id }).fetch();
  },
  findBookPages: function (_id) {
    return Books.findOne(_id);
  },
  createBook: function (data) {
    prevCount = Coordinates.findOne({ _id: data.coordinateId }).booksCount;
    Coordinates.update(
      { _id: data.coordinateId },
      { $set: { booksCount: prevCount + 1 } }
    );

    Books.insert(data);
    return data;
  },

  addPage: function (data, _id) {
    if (this.userId) {
      const updatedData = run([String(data.content)]).then((event) => {
        Profiles.update(
          { userId: this.userId },
          { $push: { posts: { post: data.content, timePosted: Date.now() } } }
        );

        data["score"] = event;

        Books.update({ _id: _id }, { $push: { pages: data } });

        const bookInfoScore = updateBook(_id, data);

        return bookInfoScore;
      });

      return updatedData;
    } else {
      return { header: "Must Log In" };
    }
  },
  findProfile: function (profileInfo) {
    if (this.userId) {
      return Profiles.findOne({ userId: this.userId });
    } else {
      return ["none"];
    }
  },
  getBenchLocations: function (x) {
    const range = 0.035;
    //const boundingBox = [ x.longitude + range, x.latitude + range, x.longitude - range,  x.latitude - range]
    //

    const benchLocation = axios
      .get(
        `http://open.mapquestapi.com/nominatim/v1/search.php?key=${
          Meteor.settings.OSMKey
        }&format=json&q=bench&addressdetails=1&limit=3&viewbox=${
          x.longitude + range
        }%2C${x.latitude + range}%2C${x.longitude - range}%2C${
          x.latitude - range
        }&bounded=1`
      )
      .then((response) => {
        let responseArr = {'Tracked': [], 'Untracked': []};
        for (const item in response.data) {
          const foundItem = Coordinates.findOne({
            mapId: response.data[item].place_id,
          });
          console.log(foundItem)

          if (foundItem === undefined) {
            console.log(response.data[item])
            responseArr['Untracked'].push(response.data[item]);
          } else {
            responseArr['Tracked'].push(foundItem);
          }
        }

     /*    var filteredArr = res.reduce(
          (s, x) => {
            s[(typeof(x.booksCount) !== 'undefined')].push(x);
            return s;
          },
          {true: [], false: []}, */

       

        return responseArr;
      });

    return benchLocation;
  },
});
