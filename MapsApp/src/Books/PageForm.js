
import React, {useEffect, useState} from 'react';
import Meteor, {Mongo, withTracker} from '@meteorrn/core';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity
} from 'react-native'



const PageForm = ({route, navigation}) =>  {
  const [content, setContent] = useState("")
  const { itemId } = route.params;

  function addPage() {
    console.log(itemId)
    const data = {
      content: content,
      datePosted: Date.now(),
 
    }
    Meteor.call('addPage', data, itemId, function (err, res) {
      if (err) {
        console.log(err);
      } else {
        console.log(res, 'success!');
  
      }
    });
    setContent("")
  }

 

    return (
      <View style={styles.container}>
        <Text style={styles.content}>Redup</Text>
        <TextInput
          value={content}
          placeholder='Title'
          style={styles.foodInput}
          onChangeText={text => setContent(text)}
        />
        <TouchableOpacity
          style={{ marginBottom: 16 }}
          onPress={addPage}>
          <Text style={{ fontSize: 22, color: '#5fc9f8' }}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginBottom: 16 }}
          onPress={() =>
            this.props.navigation.navigate('FoodList')}>
          <Text style={{ fontSize: 22 }}>Go to WaaList</Text>
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
  content: {
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




export default PageForm;