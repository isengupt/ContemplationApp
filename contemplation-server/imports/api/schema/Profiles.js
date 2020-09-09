import {Mongo} from "meteor/mongo";
import SimpleSchema from "simpl-schema"
import {Tracker} from 'meteor/tracker'

const Profiles = new Mongo.Collection("Profiles")

const PostSchema = new SimpleSchema({
    post: {
        type: String,
        label: "The content of the post"
    },
    timePosted: {
        type: Date,
        label: "The date the post was made"
    },
 
})

const ProfileSchema = new SimpleSchema({
    name: {
        type: String,
        label: "Name of the user"
    },
    userId: {
        type: String,
        label: "The user id associated with the user"
    },
    posts: {
        type: Array,
        label: "Posts in books",
        defaultValue: []
    },   
    'posts.$': {
        type: PostSchema,
        label: "The array of posts by the user"
    },
}, {tracker: Tracker})

Profiles.attachSchema(ProfileSchema);

if (Meteor.isServer) {
Profiles.rawCollection().createIndex({userId: -1})
}

export {Profiles, ProfileSchema}