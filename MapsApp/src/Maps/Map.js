
import React, {useEffect, useState} from 'react';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Meteor, {Mongo, withTracker} from '@meteorrn/core';
import { View, Button } from 'react-native';




const Map = ({navigation}) => {
    const [coordinates, setCoordinates] = useState([]);
    const [message, setMessage] = React.useState('');
    React.useEffect(() => {
     
      Meteor.call('getCoordinates', function (err, res) {
        if (err) {
          console.log(err);
        } else {
          console.log(res, 'success!');
          setCoordinates(res);
        }
      });
    });
  
    /*  function getPoints() {
      Meteor.call('getCoordinates', function(err, res) {
        if (err){
          console.log(err)
        }else{
          console.log(res, "success!")     
        }
    })
  } */

  function markerClick(pointId) {
    navigation.navigate('books', {
      itemId: pointId,
    })
    
  }
  
    return (
      <View style={{flex: 1}}>
        <MapView
          style={{flex: 1}}
          provider={PROVIDER_GOOGLE}
          showsUserLocation
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          {coordinates &&
            coordinates.map((point) => (
              <MapView.Marker
                key={point._id}
                coordinate={{
                  latitude: point.latitude,
                  longitude: point.longitude,
                }}
                title={point.title}
                onPress={() => markerClick(point._id)}
              />
            ))}
        </MapView>
          <View
          style={{
              position: 'absolute',//use absolute position to show button on top of the map
              top: '50%', //for center align
              alignSelf: 'flex-end' //for align to right
          }}
      >
         <Button
    style={{fontSize: 20, color: 'green'}}
    styleDisabled={{color: 'red'}}
    onPress={() => navigation.navigate('books')}
    title="Press Me"
  >
    Navigate
  </Button>
      </View> 
      </View>
    );
  };

export default Map;