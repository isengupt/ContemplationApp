import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';

import Meteor, {Accounts, Mongo, withTracker} from '@meteorrn/core';
const Profiles = new Mongo.Collection('Profiles');
function ProfilePage(props) {
  const user = Meteor.user();
  const [profileInfo, setProfileInfo] = React.useState([]);
  console.log(props.profileData)
  useEffect(() => {
    setProfileInfo(props.profileData)
  }, [props.profileData])

  if (user) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

        <Text>{profileInfo.name}</Text>
         
      </View>
    );
  } else {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>No Profile</Text>
      </View>
    );
  }
}

const ProfileContainer = withTracker((props) => {
  const handle = Meteor.subscribe('getProfile');

  return {
    profileData: Profiles.find({}).fetch()[0],
    loading: !handle.ready(),
  };
})(ProfilePage);

export default ProfileContainer;
