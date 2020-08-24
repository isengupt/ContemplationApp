import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Map from '../src/Maps/Map'
import BookList from './Books/BookList'
import foodList from './Foods/foodList';
import foodForm from './Foods/foodForm';
import BookDetailContainer from './Books/BookDetail'
import PageForm from './Books/PageForm'
const Stack = createStackNavigator();


const AppNavigator = () => {
    return (
    <Stack.Navigator>
      <Stack.Screen name="map" component={Map} />
      <Stack.Screen name="createBook" component={foodForm}/>
      <Stack.Screen name="books" component={BookList}/>
      <Stack.Screen name="book" component={BookDetailContainer}/>
      <Stack.Screen name="addPageForm" component={PageForm}/>
    </Stack.Navigator>
    )
  };

export default AppNavigator;