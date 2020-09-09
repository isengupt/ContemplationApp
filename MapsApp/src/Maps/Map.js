import React, {useEffect, useState, useRef} from 'react';
import MapView, { Callout} from 'react-native-maps';
import Meteor from '@meteorrn/core';
import {View, Text, StyleSheet, StatusBar, Alert, Animated, TouchableHighlight} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {Icon} from 'native-base'
import UntrackedLocationMarker from './UntrackedMarkers'
import TrackedLocationMarker from './Markers.js'



const Box = ({

  scale = 1,
  colorObj
}) => (
  <Animated.View
    style={[
      {
        width: 40,
        height: 40,
        borderRadius: 25,
        backgroundColor: colorObj.backgroundColor,
        transform: [{scale}],
        borderColor: colorObj.borderColor,
        borderWidth: 1,
      },
    ]}></Animated.View>
);



function getColors(sentimentValue) {
  console.log(sentimentValue)
  if (sentimentValue > 0.9) {
    return {backgroundColor: 'rgb(0, 255, 0, 0.3)', borderColor: 'rgb(0, 255, 0, 0.5)'}
  }
  else if (sentimentValue > 0.6 && sentimentValue < 0.9)
  {
    return {backgroundColor: 'rgb(0, 0, 255, 0.3)', borderColor: 'rgb(0, 0, 255, 0.5)'}
  }
  else if (sentimentValue > 0.3 && sentimentValue < 0.6) {

    return {backgroundColor: 'rgb(255, 0, 0, 0.3)', borderColor: 'rgb(255, 0, 0, 0.5)'}
  }
  else {
    return {backgroundColor: 'rgba(0,0,0, 0.3)', borderColor: 'rgba(0,0,0, 0.5)'}
  }
}

const Map = ({navigation}) => {
  const [currPosition, setCurrPosition] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });

  const [trackedBenches, setTrackedBenches] = useState([]);
  const [untrackedBenches, setUntrackedBenches] = useState([]);

  const mapRef = useRef(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableHighlight
        style={styles.closeButton}
        onPress={() => {
          navigation.toggleDrawer()
        }}>
        <Icon
          name="menu-outline"
          style={{color: '#383B41', fontSize: 20}}></Icon>
      </TouchableHighlight>
     
      ),
    });
  }, [navigation]);
  function goToInitialLocation(locationObj) {
    let initialRegion = Object.assign({}, locationObj);
    initialRegion['latitudeDelta'] = 0.0922;
    initialRegion['longitudeDelta'] = 0.0421;
    mapRef.current.animateToRegion(initialRegion, 1000);
  }

  const onChange = ({coords}) => {
    
    setCurrPosition({
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
    });

    Meteor.call('getBenchLocations', coords, function (err, res) {
      if (err) {
        console.log(err);
      } else {
        console.log(res)
       
       /*  var filteredArr = res.reduce(
          (s, x) => {
            s[(typeof(x.booksCount) !== 'undefined')].push(x);
            return s;
          },
          {true: [], false: []},
        );
       */
        setTrackedBenches(res['Tracked']);
        setUntrackedBenches(res['Untracked']);
      }
    });
  };
useEffect(() => {
    watchId = Geolocation.watchPosition(
      onChange,
      (error) => console.log(error.message),
      {
        enableHighAccuracy: true,
        timeout: 60000,
        maximumAge: 0,
        distanceFilter: 10,
      },
    );

    return () => {
      Geolocation.clearWatch(watchId);
     
    };
  }, []);

  function markerClick(pointId) {

    console.log('Current Location', pointId);

    console.log(currPosition);
    Meteor.call('createPortalAtCoordinates', pointId, currPosition, function (
      err,
      res,
    ) {
      if (err) {
        console.log(err);
      } else {
        console.log(res, 'success!');
        console.log(typeof res);
        if (typeof res === 'object') {
          Alert.alert(String(res.heading), String(res.message), [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ]);
        } else if (typeof res === 'string') {
          console.log('The res is ', res)
          navigation.navigate('books', {
            itemId: res,
          });
        }
      }
    });
  }



  return (
    <View style={{flex: 1}}>
      <MapView
        style={{flex: 1}}
  
        ref={mapRef}
        onUserLocationChange={(event) =>

          goToInitialLocation({
            latitude: event.nativeEvent.coordinate.latitude,
            longitude: event.nativeEvent.coordinate.longitude,
          })
        }
        showsUserLocation={true}
   

        initialRegion={
          {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  }
        }>
        {trackedBenches &&
          trackedBenches.map((point, index) => (
            <TrackedLocationMarker key={index} point={point} markerClick={markerClick}/>
    
          ))}
        {untrackedBenches &&
          untrackedBenches.map((point, index) => (
            <UntrackedLocationMarker key = {index} point={point} markerClick={markerClick}/>
          ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  bubbleTitle: {
    fontSize: 14,

    marginBottom: 5,
    color: '#383B41',
    fontWeight: '500'
  },
  bubble: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 6,


    padding: 15,
    width: 150,
  },
  markerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(130,4,150, 0.9)',
    position: 'absolute',
  },
  blueText: {
    fontWeight: '700',
    color: '#445EE9',
    fontSize: 14,
    marginBottom: 5,
  }
});

export default Map;
