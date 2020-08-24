import { Meteor } from 'meteor/meteor';
import {Coordinates} from '../../api/schema/Coordinates'


function addCoordinates(data) {
    console.log(` Adding point for ${data.title}`)
    Coordinates.insert(data)
}

if (Coordinates.find().count() === 0) {
    if (Meteor.settings.defaultPoints) {
        console.log('Creating default coordinates.');
        Meteor.settings.defaultPoints.map(data => addCoordinates(data));
    }
}
