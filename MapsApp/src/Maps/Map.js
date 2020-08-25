
import React, {useEffect, useState} from 'react';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Meteor, {Mongo, withTracker} from '@meteorrn/core';
import { View, Button } from 'react-native';
import {useFocusEffect} from '@react-navigation/native';



const Map = ({navigation}) => {
    const [coordinates, setCoordinates] = useState([]);
    const [benches, setBenches] = useState([])
    const [message, setMessage] = React.useState('');
    const [location, setLocation] = useState({
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    })
    useFocusEffect(() => {
     console.log('waa')
   /*    Meteor.call('getCoordinates', function (err, res) {
        if (err) {
          console.log(err);
        } else {
          console.log(res, 'success!');
          setCoordinates(res);
        }
      }); */
    }, []);
  
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
    //console.log(pointId)
    Meteor.call('createPortalAtCoordinates', pointId, function (err, res) {
      if (err) {
        console.log(err);
      } else {
        console.log(res, 'success!');
        navigation.push('books', {
          itemId: res
        })

      }
    });
 /*    navigation.navigate('books', {
      itemId: pointId,
    }) */
    
  }

  

  function recordEvent(x){

    console.log(x)
    Meteor.call('getBenchLocations', x, function (err, res) {
      if (err) {
        console.log(err);
      } else {
        console.log(res, 'success!');
        setBenches(res)

      }
    });
  }
  
    return (
      <View style={{flex: 1}}>
        <MapView
          style={{flex: 1}}
          provider={PROVIDER_GOOGLE}
          showsUserLocation
          onRegionChangeComplete={(x) => recordEvent(x)}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          
            {benches && 
            benches.map((point) => (
              <MapView.Marker
    key={point.place_id}
    coordinate={{
      latitude: Number(point.lat),
      longitude: Number(point.lon),
    }}
    title={point.display_name}
    onPress={() => markerClick(point)}     />
            ))
            
            }
        </MapView>
   
      </View>
    );
  };

export default Map;