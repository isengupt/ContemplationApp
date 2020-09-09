const tf = require("@tensorflow/tfjs");
require("@tensorflow/tfjs-node");
const fetch = require("node-fetch");

class SentimentModel {
  constructor(text) {
    this.text = text
  }

  getMetaData = async () => {
    const metadata = await fetch(
      "https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json"
    );
    return metadata.json();
  };

  loadModel = async () => {
    const url = `https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json`;
    const model = await tf.loadLayersModel(url);
    return model;
  };
  padSequences = (sequences) => {
    return sequences.map((seq) => {
      console.log(seq);
      if (seq.length > this.metadata.max_len) {
        seq.splice(0, seq.length - metadata.max_len);
      }
      if (seq.length < this.metadata.max_len) {
        const pad = [];
        for (let i = 0; i < this.metadata.max_len - seq.length; ++i) {
          pad.push(0);
        }

        seq = pad.concat(seq);
      }
      console.log(seq);
      return seq;
    });
  };
  getSentiment = (score) => {
    if (score > 0.66) {
      return `Score of ${score} is Positive`;
    } else if (score > 0.4) {
      return `Score of ${score} is Neutral`;
    } else {
      return `Score of ${score} is Negative`;
    }
  };
   predict = (text, model, metadata) => {
    const trimmed = text.trim().toLowerCase().replace(/(\.|\,|\!)/g, '').split(' ');
    const sequence = trimmed.map(word => {
      const wordIndex = metadata.word_index[word];
      if (typeof wordIndex === 'undefined') {
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
  }
   run = async (text) => {
    const model = await loadModel(); 
    const metadata = await getMetaData();
    let sum = 0;
    text.forEach(function (prediction) {
      console.log(` ${prediction}`);
      const perc = predict(prediction, model, metadata);
      sum += parseFloat(perc, 10);
    })
    console.log(getSentiment(sum/text.length));
  }
}

sentimentModel = new SentimentModel(['text'])
sentimentModel.run(['text'])


//export const sentimentModel = new SentimentModel()
