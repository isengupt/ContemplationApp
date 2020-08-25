import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Books } from '../schema/Books';

Meteor.publish('BooksData', function publish(_id) {
  if (!_id) { 
    console.log("no id")
  } else {
    const data = Books.find({'_id': _id})
    return data
  }
  return this.ready()
})
