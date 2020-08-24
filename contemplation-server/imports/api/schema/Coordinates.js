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
    }
}, {tracker: Tracker})

Coordinates.attachSchema(CoordinatesSchema);

if (Meteor.isServer) {
Coordinates.rawCollection().createIndex({title: -1})
}

export {Coordinates, CoordinatesSchema}