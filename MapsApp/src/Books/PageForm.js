import React, {useEffect, useState} from 'react';
import Meteor, {Mongo, withTracker} from '@meteorrn/core';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  NativeModules,
  Image
} from 'react-native';
import {Input} from 'native-base';


const PageForm = ({route, navigation, itemId, setModalVisible}) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false)

  const getSentiment = async (data) => {
    const response = await NativeModules.LangParser.getSentiment(data);
    console.log(response); 
    return response
  };


  function addPage() {
    setLoading(true)
  

    getSentiment(content).then((res) => {
      console.log({content: content, datePosted: Date.now(), score: res})
      const data = {content: content, datePosted: Date.now(), score: res}
      Meteor.call('addPage', data, itemId, async function (err, res) {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
          setLoading(false)
          setContent('');
          setModalVisible(false)
          
        }
      })
    })
   

   /*  Meteor.call('addPage', data, itemId, async function (err, res) {
      if (err) {
        console.log(err);
      } else {
        console.log(res);
        setLoading(false)
        setContent('');
        setModalVisible(false)
        
      }
    }); */
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
