import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  setCustomView,
  setCustomTextInput,
  setCustomText,
  setCustomImage,
  setCustomTouchableOpacity
} from 'react-native-global-props';
import {
  View,
  Text,
  FlatList,
  Alert,
  Modal,
  TouchableHighlight,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Map from '../src/Maps/Map'
import BookListContainer from './Books/BookList'

import ProfileContainer from './Profile/Profiles' 
import foodForm from './Foods/foodForm';
import BookDetailContainer from './Books/BookDetail'
import PageForm from './Books/PageForm'
import LoginForm from './Login/LoginForm';
import { createDrawerNavigator } from '@react-navigation/drawer';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();



function AppNavigator () {
  return (

    <Stack.Navigator>
    <Stack.Screen name="login" component={LoginForm}/>
    <Stack.Screen name="map" component={Map} />
    <Stack.Screen name="createBook" component={foodForm}/>
    <Stack.Screen name="books" component={BookListContainer}/>
    <Stack.Screen name="book" component={BookDetailContainer}/>
    <Stack.Screen name="addPageForm" component={PageForm}/>
  </Stack.Navigator>

  );
}


function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={AppNavigator} />
      <Drawer.Screen name="Profile" component={ProfileContainer} />
    </Drawer.Navigator>
  );
}





/* 
function AppNavigator () {
    return (
 
      <Stack.Navigator>
      <Stack.Screen name="login" component={LoginForm}/>
      <Stack.Screen name="map" component={Map} />
      <Stack.Screen name="createBook" component={foodForm}/>
      <Stack.Screen name="books" component={BookListContainer}/>
      <Stack.Screen name="book" component={BookDetailContainer}/>
      <Stack.Screen name="addPageForm" component={PageForm}/>
    </Stack.Navigator>
  
    );
  }  */

export default MyDrawer;