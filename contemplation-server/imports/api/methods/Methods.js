import { Meteor } from "meteor/meteor";
import { Coordinates } from "../schema/Coordinates";
import { Books } from "../schema/Books";

Meteor.methods({
  getCoordinates: function () {
    let coordinatesData = Coordinates.find({}).fetch();
    console.log(coordinatesData);
    return coordinatesData;
  },
  getBooks: function (_id) {
    return Books.findOne({ '_id': _id });
  },
  getBooksAtLocation: function(_id) {
    console.log('books at location')
    return Books.find({'coordinateId': _id}).fetch()
  },
  findBookPages: function(_id) {
    return Books.findOne(_id)
  },
  createBook: function(data) {
    console.log(data)
    Books.insert(data)
    return data

  },
  createPage: function(data, _id) {
    Books.update({ _id: id },{ $push: { pages: data }})
  },
  addPage: function(data, _id){
    console.log(data)

  Books.update({ '_id': _id }, {$push: {'pages': data}})

  return Books.findOne(_id)
  }
});
