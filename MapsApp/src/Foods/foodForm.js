
import React, {useEffect, useState} from 'react';
import Meteor, {Mongo, withTracker} from '@meteorrn/core';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity
} from 'react-native'



const FoodForm = ({route, navigation}) =>  {
  const [title, setTitle] = useState("")
  const { itemId } = route.params;

  function addBook() {
    console.log(title)
    const data = {
      title: title,
      datePosted: Date.now(),
      coordinateId: itemId
    }
    Meteor.call('createBook', data, function (err, res) {
      if (err) {
        console.log(err);
      } else {
        console.log(res, 'success!');
  
      }
    });
    setTitle("")
  }

 

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Redux</Text>
        <TextInput
          value={title}
          placeholder='Title'
          style={styles.foodInput}
          onChangeText={text => setTitle(text)}
        />
        <TouchableOpacity
          style={{ marginBottom: 16 }}
          onPress={addBook}>
          <Text style={{ fontSize: 22, color: '#5fc9f8' }}>Submit</Text>
        </TouchableOpacity>
  
      </View>
    );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 64,
    marginBottom: 48
  },
  foodInput: {
    fontSize: 32,
    marginBottom: 32,
    borderWidth: 1,
    padding: 8,
    width: '80%',
    borderRadius: 10,
  }
});




export default FoodForm;