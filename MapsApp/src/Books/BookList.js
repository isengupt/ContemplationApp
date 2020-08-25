import React, {useEffect, useState} from 'react';
import Meteor, {Mongo, withTracker} from '@meteorrn/core';
import {
  View,
  Button,
  Text,
  NativeModules,
  FlatList,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

function BookList({route, navigation}) {
  const [bookItems, setBookItems] = useState(false);

  const {itemId} = route.params;

  useEffect(() => {
    Meteor.call('getBooksAtLocation', itemId, function (err, res) {
      if (err) {
        console.log(err);
      } else {
        console.log(res, 'success!');
        setBookItems(res);
      }
    });
  }, []);

  function navigateToBook(_id) {
    navigation.push('book', {
      itemId: _id,
    });
  }

  const renderItem = ({item}) => <BookInfo item={item} />;

  const BookInfo = ({item}) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>

      <Button title="See Book" onPress={() => navigateToBook(item._id)} />
    </View>
  );

  function createBook() {
    navigation.push('createBook', {
      itemId: itemId,
    });
  }

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>itemId: {JSON.stringify(itemId)}</Text>
      <SafeAreaView style={styles.container}>
        {bookItems && (
          <FlatList
            data={bookItems}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
          />
        )}
      </SafeAreaView>
      <Button
        title="Press this"
        onPress={() => {
          NativeModules.RNHello.findEvents((resp) => {
            alert(resp);
          });
        }}
      />
      <Button title="Add a book" onPress={createBook} />
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

export default BookList;
