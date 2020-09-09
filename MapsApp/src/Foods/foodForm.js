
import React, {useEffect, useState} from 'react';
import Meteor, {Mongo, withTracker} from '@meteorrn/core';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity
} from 'react-native'
import {Icon} from 'native-base'



const FoodForm = ({route, navigation, itemId}) =>  {
  const [title, setTitle] = useState("")


  function addBook() {
    console.log(title)
    console.log(itemId)
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
        <Text style={styles.title}>Create a book</Text>
        <View style={styles.flexrow}>
        <TextInput
          value={title}
          placeholder='Name of the book'
          style={styles.foodInput}
          onChangeText={text => setTitle(text)}
          multiline={true}
        />
     
    </View>
    <TouchableOpacity
    style={styles.submitbutton}
    onPress={addBook}>
         <Text style={styles.blueText}>Submit</Text>
  </TouchableOpacity>
      </View>
    );
  
};

const styles = StyleSheet.create({
  container: {

    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: 250,
    position: 'relative' 
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
 
    color: '#383B41',
  },
  foodInput: {

    alignItems: 'stretch',
    fontSize: 16,
    color: '#383B41',
    fontWeight: '400',
    marginBottom: 30,
  },
  flexrow: {
  
  },
  submitbutton: {
    position: "absolute",
    right: 0,
    bottom: 0,
   
  },
  blueText: {
    fontWeight: '700',
    color: '#445EE9',
    fontSize: 16,
  }
});




export default FoodForm;