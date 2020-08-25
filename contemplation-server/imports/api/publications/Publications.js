import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Books } from '../schema/Books';

Meteor.publish('BooksData', function publish(_id) {
  if (this.userId) { 
  
  } else {
    const data = Books.find({'_id': _id})
    return data
  }
  return this.ready()
})
