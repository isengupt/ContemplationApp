import {Mongo} from "meteor/mongo";
import SimpleSchema from "simpl-schema"
import {Tracker} from 'meteor/tracker'

const Books = new Mongo.Collection("Books")

const BookEntries = new SimpleSchema({
   
    content: {
        type: String,
        label: "The entry / content in the book"
    },
    datePosted: {
        type: Date,
        label: "Date the entry was posted in the book"
    },


})

const BooksSchema = new SimpleSchema({
    title: {
        type: String,
        label: "Name of the books"
    },
    userId: {
        type: String,
        label: "Id of the user that posted the book",
        optional: true
    },
    pages: {
        type: Array,
        label: "Entries in the book",  
        defaultValue: []
    },
    'pages.$': {
        type: BookEntries,
        label: "The paginated entries in the book",
    
    },   
    datePosted: {
        type: Date,
        label: "Date the book was created"
    },
    coordinateId: {
        type: String,
        label: "Id of the point where the book is located",
        optional: true
    }
}, {tracker: Tracker})



Books.attachSchema(BooksSchema);

if (Meteor.isServer) {
Books.rawCollection().createIndex({title: -1})
}

export {Books, BooksSchema}