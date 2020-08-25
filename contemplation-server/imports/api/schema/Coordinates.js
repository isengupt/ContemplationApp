import {Mongo} from "meteor/mongo";
import SimpleSchema from "simpl-schema"
import {Tracker} from 'meteor/tracker'

const Coordinates = new Mongo.Collection("Coordinates")

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
    }
}, {tracker: Tracker})

Coordinates.attachSchema(CoordinatesSchema);

if (Meteor.isServer) {
Coordinates.rawCollection().createIndex({title: -1})
}

export {Coordinates, CoordinatesSchema}