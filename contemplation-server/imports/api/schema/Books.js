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
    score: {
        type: Number,
        label: "Sentiment score for the page"
    },
    mainPoints: {
        type: Array,
        label: "Summarized points from the entry",
        defaultValue: []
    },
    'mainPoints.$': {
        type: String,
        label: "The main points in entry for semantic similarity"
    
    }



})

const TimeEntries = new SimpleSchema({
    score: {
        type: Number,
        label: "The overall sentiment score of the book"
    },
    timeCalculated: {
        type: Date,
        label: "The date the sentiment was taken for the book"
    },
    contentCloud: {
        type: Array,
        label: "Most talked about points at time period",
        defaultValue: []
    },
    'contentCloud.$': {
        type: String,
        label: "The most talked about sentences / points",
    
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
    timePoints: {
        type: Array,
        label: "Sentiment of area/ book as a chronology",
        defaultValue: []
    },   
    'timePoints.$': {
        type: TimeEntries,
        label: "The time entries object"
    },  
    datePosted: {
        type: Date,
        label: "Date the book was created"
    },
    coordinateId: {
        type: String,
        label: "Id of the point where the book is located",
        optional: true
    },
    status: {
        type: String,
        label: "Status of whether the book is still writable",
        allowedValues: ['Open', 'Archived'],
        defaultValue: 'Open'
      },
}, {tracker: Tracker})



Books.attachSchema(BooksSchema);

if (Meteor.isServer) {
Books.rawCollection().createIndex({title: -1})
}

export {Books, BooksSchema, TimeEntries}