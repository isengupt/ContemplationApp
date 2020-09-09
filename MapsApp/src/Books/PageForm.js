import React, {useEffect, useState} from 'react';
import Meteor, {Mongo, withTracker} from '@meteorrn/core';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import {Input} from 'native-base';


const PageForm = ({route, navigation, itemId, setModalVisible}) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false)


  function addPage() {
    setLoading(true)
    console.log(itemId);
    console.log(content);
    var data = {
      datePosted: Date.now(),
    };
    data['content'] = content;

    console.log(data);

    Meteor.call('addPage', data, itemId, async function (err, res) {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
        setLoading(false)
        setContent('');
        setModalVisible(false)
        
      }
    });
  }

 

  function changeText(text) {

    setContent(text);
  }

  return (
    <>
    <View style={styles.container}>
     
      <Input
        value={content}
        placeholder="Write your entry here"
        style={styles.fullScreenText}
        multiline={true}
        onChangeText={(text) => changeText(text)}
      />
     
      
    


    
    </View>
    {loading ?
        <Image
          style={styles.stretch}
          source={require('./loading.gif')}
        /> :
      <></>
      }
    <TouchableOpacity style={{marginBottom: 60}} onPress={addPage}>
        <Text style={styles.submit}>Submit</Text>
      </TouchableOpacity>
      </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    maxWidth: '100%',
    flex: 1,
    padding: 20,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  content: {
    fontSize: 64,
    marginBottom: 48,
  },
  fullScreenText: {
    flex: 1,
    alignItems: 'stretch',
    fontSize: 16,
    color: '#383B41',
    fontWeight: '400',
  },
  submitContainer: {
  marginBottom: 40,


alignItems: 'center',
justifyContent: 'center',
alignContent: 'center'
  },
submit: {
   alignSelf: 'center',

    fontWeight: '700',
    color: '#445EE9',
    fontSize: 18,
  },


});

export default PageForm;
