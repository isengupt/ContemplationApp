import React, {useEffect, useState} from 'react';
import Meteor, {Mongo, withTracker} from '@meteorrn/core';
//import Books from '/contemplation-server/imports/api/schema/Books'
import { View, Button, Text, Dimensions, FlatList, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import Paginator from './Paginator';

const Books = new Mongo.Collection("Books");


function BookDetail({ route, navigation, bookData }) {
  const itemWidth = Dimensions.get('window').width;
  const [pageData, setPageData] = useState(false)

console.log(bookData)
  const { itemId } = route.params;

  useEffect(() => {
    setPageData(bookData)
    console.log('changed')
  }, [bookData])

  function addPage() {

      navigation.push('addPageForm', {
        itemId: itemId,
      })
  }

  const renderItem = ({ item }) => (
    <BookInfo item={item} />
  );

  const BookInfo = ({ item }) => (
    <View style={{width: itemWidth}}>
      <Text>{item.content}</Text>
  
    </View>
  );


    return (
      <View style={{ flex: 1 }}>
     
        <Text>Book Id {JSON.stringify(itemId)}</Text>
        <Button
          title="Add page"
          onPress={addPage}
        />

       {pageData[0] ? 

       <Paginator
          data={pageData[0].pages}
          renderItem={renderItem}
         
          itemWidth={itemWidth}
        /> 
     
    : <Text>No data</Text>
       }

      </View>
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
  });



const BookDetailContainer = withTracker(props => {
  console.log(props.route.params.itemId)
  const routeId = props.route.params.itemId
  const bookDatum = Books.find({}).fetch();
  console.log(bookDatum)

  const handle = Meteor.subscribe("BooksData", routeId);

  return {
      bookData: Books.find({}).fetch(),
      loading: !handle.ready()
      
  };
  
})(BookDetail);

export default BookDetailContainer