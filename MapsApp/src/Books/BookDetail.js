import React, {useEffect, useState} from 'react';
import Meteor, {Mongo, withTracker} from '@meteorrn/core';
//import Books from '/contemplation-server/imports/api/schema/Books'
import { View, Button, Text, FlatList, StyleSheet, StatusBar, SafeAreaView } from 'react-native';

const Books = new Mongo.Collection("Books");


function BookDetail({ route, navigation, bookData }) {
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
    <View style={styles.item}>
      <Text style={styles.title}>{item.content}</Text>
  
    </View>
  );


    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
     
        <Text>Book Id {JSON.stringify(itemId)}</Text>
        <Button
          title="Add page"
          onPress={addPage}
        />
      <SafeAreaView style={styles.container}>
       {pageData[0] ?  
      <FlatList
        data={pageData[0].pages}
        renderItem={renderItem}
       
      />
    : <Text>No data</Text>
       }
    </SafeAreaView> 
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