import React, {useEffect, useState, useRef} from 'react';
import MapView, {PROVIDER_GOOGLE, Callout} from 'react-native-maps';
import Meteor from '@meteorrn/core';
import {View, Text, StyleSheet, StatusBar, Alert, Animated, TouchableHighlight} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {Icon} from 'native-base'
import { useFocusEffect } from '@react-navigation/native';


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

const usePulse = (startDelay = 500) => {
  const scale = useRef(new Animated.Value(1)).current;

  const pulse = () => {
    Animated.sequence(
      [
        Animated.timing(scale, {toValue: 1.0, useNativeDriver: true}),
        Animated.timing(scale, {toValue: 0.8, useNativeDriver: true}),
      ],
      {useNativeDriver: true},
    ).start(() => pulse());
  };

  useEffect(() => {
    const timeout = setTimeout(() => pulse(), startDelay);
    return () => clearTimeout(timeout);
  }, []);

  return scale;
};

function getColors(sentimentValue) {
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
       
        var filteredArr = res.reduce(
          (s, x) => {
            s[(typeof(x.booksCount) !== 'undefined')].push(x);
            return s;
          },
          {true: [], false: []},
        );
      
        setTrackedBenches(filteredArr['true']);
        setUntrackedBenches(filteredArr['false']);
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
          navigation.push('books', {
            itemId: res,
          });
        }
      }
    });
  }

  const scale2 = usePulse();

  return (
    <View style={{flex: 1}}>
      <MapView
        style={{flex: 1}}
        provider={PROVIDER_GOOGLE}
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
          trackedBenches.map((point) => (
            <MapView.Marker
              key={point.mapId}
              coordinate={{
                latitude: Number(point.latitude),
                longitude: Number(point.longitude),
              }}
              title={point.title}>
              <Animated.View style={styles.markerWrap}>
             
     
              {point.timePoints.length > 0 ?
              <>
                <Box scale={scale2} colorObj={getColors(point.timePoints[point.timePoints.length - 1 ].score)}/>
                <View style={{...styles.marker, backgroundColor: getColors(point.timePoints[point.timePoints.length - 1 ].score).backgroundColor }} />
                </>
                :
                <>
                <Box scale={scale2} colorObj={{backgroundColor: 'transparent', borderColor: 'black'}} />

                <View style={{...styles.marker, backgroundColor: 'black'}} />
                </>
                } 
              </Animated.View>

              <Callout tooltip onPress={() => markerClick(point)}>
                <View>
                  <View style={styles.bubble}>
                  <Text style={styles.bubbleTitle}>{String(point.title).substr(0, 25)}...</Text>
                  <Text style={styles.blueText}>{point.booksCount} books</Text>
                  <Text style={styles.blueText}>Go</Text>
                   
                    
                  </View>
                </View>
              </Callout>
            </MapView.Marker>
          ))}
        {untrackedBenches &&
          untrackedBenches.map((point) => (
            <MapView.Marker
              key={point.place_id}
              coordinate={{
                latitude: Number(point.lat),
                longitude: Number(point.lon),
              }}
              title={point.display_name}>
              {/*      
             
            
          */}
              <Animated.View style={styles.markerWrap}>
       
                <Box scale={scale2} colorObj={{backgroundColor: 'transparent', borderColor: 'black'}} />
                <View style={{...styles.marker, backgroundColor: 'black'}} />
              </Animated.View>

              <Callout tooltip onPress={() => markerClick(point)}>
                <View>
                  <View style={styles.bubble}>
                  <Text style={styles.bubbleTitle}>{String(point.display_name).substr(0, 25)}...</Text>
                  </View>
                </View>
              </Callout>
            </MapView.Marker>
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
