import { Meteor } from "meteor/meteor";
import { Coordinates } from "../schema/Coordinates";
import { Books } from "../schema/Books";
const axios = require('axios')

Meteor.methods({
  getCoordinates: function () {
    let coordinatesData = Coordinates.find({}).fetch();
    console.log(coordinatesData);
    return coordinatesData;
  },
  createPortalAtCoordinates: function (pointInfo) {
    const data = {
      title: pointInfo.display_name,
      latitude: pointInfo.lat,
      longitude: pointInfo.lon,
      mapId: pointInfo.place_id
    }
    var locationId = ""
    
    if (Coordinates.findOne({'mapId':  pointInfo.place_id})) {
      console.log(Coordinates.findOne({'mapId':  pointInfo.place_id}))
      locationId = Coordinates.findOne({'mapId':  pointInfo.place_id})._id
    } else {
      console.log('Creating Portal at Point: ', pointInfo.place_id)     
      Coordinates.insert(data)
      locationId = Coordinates.findOne({'mapId':  pointInfo.place_id})._id
    }
    
    


    return locationId

  },
  getBooks: function (_id) {
    return Books.findOne({ _id: _id });
  },
  getBooksAtLocation: function (_id) {
    console.log("books at location");
    return Books.find({ coordinateId: _id }).fetch();
  },
  findBookPages: function (_id) {
    return Books.findOne(_id);
  },
  createBook: function (data) {
    console.log(data.coordinateId);

    console.log(Coordinates.findOne({'_id': data.coordinateId}).booksCount)
    prevCount = Coordinates.findOne({'_id': data.coordinateId}).booksCount
    Coordinates.update({ '_id': data.coordinateId }, { $set: { booksCount : prevCount + 1 } });
    
    Books.insert(data);
    return data;
  },
  createPage: function (data, _id) {
    Books.update({ _id: id }, { $push: { pages: data } });
  },
  addPage: function (data, _id) {
    console.log(data);

    Books.update({ _id: _id }, { $push: { pages: data } });

    return Books.findOne(_id);
  },
  getBenchLocations: function (x) {
    const range = 0.035
    //const boundingBox = [ x.longitude + range, x.latitude + range, x.longitude - range,  x.latitude - range]
    //console.log(Meteor.settings.OSMKey)
  
    
    const benchLocation = axios.get(`http://open.mapquestapi.com/nominatim/v1/search.php?key=${Meteor.settings.OSMKey}&format=json&q=bench&addressdetails=1&limit=3&viewbox=${x.longitude + range}%2C${x.latitude + range}%2C${x.longitude - range}%2C${x.latitude - range}&bounded=1`)
    .then((response) => {
      console.log(response.data);
      return response.data
  
      });

    return benchLocation

  },
});
