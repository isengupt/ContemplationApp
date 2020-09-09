import React, {useEffect, useState, useRef} from 'react';
import MapView, { Callout} from 'react-native-maps';
import Meteor from '@meteorrn/core';
import {View, Text, StyleSheet, StatusBar, Alert, Animated, TouchableHighlight} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {Icon} from 'native-base'



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
      console.log('red')
      return {backgroundColor: 'rgb(255, 0, 0, 0.3)', borderColor: 'rgb(255, 0, 0, 0.5)'}
    }
    else {
      return {backgroundColor: 'rgba(0,0,0, 0.3)', borderColor: 'rgba(0,0,0, 0.5)'}
    }
  }



function UntrackedPin(props) {
    const {point} = props;
    return (
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
 
          <Box colorObj={{backgroundColor: 'transparent', borderColor: 'black'}} />
          <View style={{...styles.marker, backgroundColor: 'black'}} />
        </Animated.View>

        <Callout tooltip onPress={() => props.markerClick(point)}>
          <View>
            <View style={styles.bubble}>
            <Text style={styles.bubbleTitle}>{String(point.display_name).substr(0, 25)}...</Text>
            </View>
          </View>
        </Callout>
      </MapView.Marker>
    );
  }


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


  export default UntrackedLocationMarker = React.memo(UntrackedPin);