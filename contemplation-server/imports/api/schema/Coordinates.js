import {Mongo} from "meteor/mongo";
import SimpleSchema from "simpl-schema"
import {Tracker} from 'meteor/tracker'

const Coordinates = new Mongo.Collection("Coordinates")

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

const CoordinatesSchema = new SimpleSchema({
    title: {
        type: String,
        label: "Name of the coordinate"
    },
    latitude: {
        type: Number,
        label: "Latitude of the coordinate"
    },
    longitude: {
        type: Number,
        label: "Longitude of the coordinate"
    },
    mapId: {
        type: String,
        label: "Open street map id given to location"
    },
    booksCount: {
        type: Number,
        label: "Number of books at location",
        defaultValue: 0
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
}, {tracker: Tracker})

Coordinates.attachSchema(CoordinatesSchema);

if (Meteor.isServer) {
Coordinates.rawCollection().createIndex({title: -1})
}

export {Coordinates, CoordinatesSchema}