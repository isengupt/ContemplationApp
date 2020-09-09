import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/alanning:roles";
import { Books } from "../schema/Books";
import { Coordinates } from "../schema/Coordinates";
import { Profiles } from "../schema/Profiles";


Meteor.publish("BooksData", function publish(_id) {
  if (!_id) {
    console.log("no id");
  } else {

    const data = Books.find({_id: _id})
 
    return data;
  }
  return this.ready();
});

Meteor.publish("BooksAtLocation", function publish(_id) {
  if (!_id) {
    console.log("no id");
  } else {
   
    const Locations = Coordinates.find({})
    console.log(Locations.fetch())
    const BooksList = Books.find({ coordinateId: _id })
    console.log(BooksList.fetch())
    return [Locations, BooksList];
  }
  return this.ready();
});

Meteor.publish("getProfile", function publish() {
  if (this.userId) {
    console.log(Profiles.find({userId: this.userId}).fetch())
    return Profiles.find({userId: this.userId})
  }
  return this.ready();
});
