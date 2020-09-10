import React, {useEffect, useState} from 'react';
import Meteor, {Mongo, withTracker} from '@meteorrn/core';
import FoodForm from '../Foods/foodForm';
import {
  View,
  Text,
  FlatList,
  Alert,
  Button,
  Dimensions,
  Modal,
  TouchableHighlight,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeModules } from 'react-native'
import {Container, Content, Icon} from 'native-base';
import Geolocation from '@react-native-community/geolocation';
import {VictoryLine, VictoryAxis, VictoryChart, VictoryTheme} from 'victory-native';
import {format} from 'date-fns';
const Books = new Mongo.Collection('Books');
const Coordinates = new Mongo.Collection('Coordinates');



function BookList({route, navigation, listData, locationData}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [sentimentData, setSentimentData] = useState([]);
  const [archivedItems, setArchivedItems] = useState([]);
  const [openItems, setOpenItems] = useState([]);

  console.log(NativeModules.LangParser)

  const {itemId} = route.params;

 

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableHighlight
        style={styles.closeButton}
        onPress={() => {
          console.log(NativeModules.LangParser.increment())
         // navigation.toggleDrawer()
        }}>
        <Icon
          name="menu-outline"
          style={{color: '#383B41', fontSize: 20}}></Icon>
      </TouchableHighlight>
     
      ),
    });
  }, [navigation]);

  useEffect(() => {
    console.log('timePoints', locationData)
    const lineData = function() { 
      if(locationData) {
      let data = []
      locationData.timePoints.map((datePoint) => {
        console.log((datePoint.timeCalculated).getTime())
        data.push({x: (datePoint.timeCalculated).getTime(), y: datePoint.score })
      }) 
      console.log(data)
      return data
    }
     else {return []}
    }
    setSentimentData(lineData())
    

   /*  locationData.timePoints.map((datePoint) => {
      console.log(String(datePoint.timeCalculated).getTime())
    }) */
  }, [locationData])

  useEffect(() => {
   

    var filteredArr = listData.reduce(
      (s, x) => {
        s[x.status == 'Archived'].push(x);
        return s;
      },
      {true: [], false: []},
    );

    setArchivedItems(filteredArr['true']);
    setOpenItems(filteredArr['false']);
  }, [listData]);

  function navigateToBook(_id) {
    navigation.navigate('book', {
      itemId: _id,
    });
  }

  const renderItem = ({item}) => <BookInfo item={item} />;

  const BookInfo = ({item}) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => navigateToBook(item._id)}>
        <View style={styles.item}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          {item.pages.length == 0 ? (
            <Text style={styles.bookPages}>No Pages</Text>
          ) : (
            <Text style={styles.bookPages}>{item.pages.length} Pages</Text>
          )}
        </View>
      </TouchableOpacity>

      <Text style={styles.bookDate}>{String(item.datePosted)}</Text>
    </View>
  );


  return (
    <View style={styles.viewContainer}>
      <ScrollView style={styles.container} nestedScrollEnabled={true}>
        <SafeAreaView style={styles.bookContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Journal</Text>
            <TouchableOpacity
              style={styles.openButton}
              onPress={() => {
                setModalVisible(true);
              }}>
              <Text style={styles.textStyle}>Add Book</Text>
            </TouchableOpacity>
          </View>
          {locationData ? (
            <>
              <Text style={styles.CoordinateHeading}>
                <Text style={styles.BooksNear}>
                  {String(locationData.booksCount)} Books found near{' '}
                </Text>

                {String(locationData.title)}
              </Text>
            </>
          ) : (
            <></>
          )}

          <View style={styles.bookContainer}>
            <View style={styles.subSections}>
              <Text style={styles.subHeading}>Open</Text>

              <Text style={styles.BooksNear}>See all</Text>
            </View>
           
              {openItems.length > 0  ? (
                <FlatList
                  horizontal
                  pagingEnabled={true}
                  showsHorizontalScrollIndicator={false}
                  legacyImplementation={false}
                  data={openItems}
                  renderItem={renderItem}
                  keyExtractor={(item) => item._id}
                />

              )                : 
                <Text style={styles.BooksNear}>No Open Books </Text>
              
              }
         
          </View>

          <View style={styles.bookContainer}>
            <View style={styles.subSections}>
              <Text style={styles.subHeading}>Archived</Text>

              <Text style={styles.BooksNear}>See all</Text>
            </View>

              {archivedItems.length > 0 ? (
                <FlatList
                  horizontal
                  pagingEnabled={true}
                  showsHorizontalScrollIndicator={false}
                  legacyImplementation={false}
                  data={archivedItems}
                  renderItem={renderItem}
                  keyExtractor={(item) => item._id}
                />
              )
              : 
                <Text style={styles.BooksNear}>No Archived Books </Text>
              
              }
     
          </View>


         
          <View style={styles.centeredView}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <TouchableHighlight
                    style={styles.closeButton}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                    }}>
                    <Icon
                      name="close"
                      style={{color: '#6b717c', fontSize: 20}}></Icon>
                  </TouchableHighlight>
                  <FoodForm itemId={itemId} />
                </View>
              </View>
            </Modal>
          </View>
        </SafeAreaView>
        <SafeAreaView style={styles.bookContainer}>
            <View style={styles.subSections}>
              <Text style={styles.subHeading}>Sentiment Chart</Text>

            
                    <Text style={styles.BooksNear}>See all</Text>
                 
             
            </View>
        <View style={styles.chartContainer}>
          <VictoryChart theme={VictoryTheme.material}>
            <VictoryLine
              data={sentimentData}
             
              padding={0}
              style={{
                data: {stroke: '#445EE9'},
                parent: {border: '1px solid #6b717c',  padding: 0},
               
              }}
            />
             <VictoryAxis
            dependentAxis={true}
            style={{
              grid: { stroke: "#6b717c" }
            }}
          />
            <VictoryAxis 
            tickFormat={(x) => ``}
          />

          </VictoryChart>
        </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    padding: 0,
    width: '100%',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignContent: 'stretch'

  },
  chart: {
    flex: 1,
  },
  container: {
    fontFamily: 'Avenir',
    backgroundColor: '#fff',
    flex: 1,
    width: '100%',
    padding: 20,
  },
  content: {
    width: '100%',
    overflow: 'scroll',
    flex: 1,
    flexDirection: 'column',
  },
  viewContainer: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-start',
 
  },
  CoordinateHeading: {
    textTransform: 'lowercase',
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 30,
    color: '#6b717c',
    fontWeight: '500',
  },
  subHeading: {
    color: '#383B41',
    fontSize: 16,

    fontWeight: '700',
  },
  bookContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    width: '100%',
    minHeight: 300,
  },
  subSections: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 5,
    color: 'white',
  },
  bookPages: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
    color: 'white',
  },
  bookDate: {
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'italic',
    marginBottom: 5,
    color: '#6b717c',
  },
  listView: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    padding: 10,
    backgroundColor: '#67D863',
    borderRadius: 4,
    width: 200,
    height: 300,
    marginBottom: 10,
    marginRight: 20,
  },
  itemContainer: {
    marginBottom: 10,
    width: 200,
    height: '100%',
    marginRight: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 10,
    color: '#383B41',
  },
  BooksNear: {
    fontWeight: '700',
    color: '#445EE9',
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  modalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
  },
  openButton: {
    fontWeight: '700',
    color: '#445EE9',
    fontSize: 16,
    borderRadius: 20,
    paddingLeft: 10,
    elevation: 2,
  },
  closeButton: {
    elevation: 2,
    color: '#383B41',
    position: 'absolute',
    right: 10,
    top: 10,
    elevation: 3,
  },
  textStyle: {
    fontWeight: '700',
    color: '#445EE9',
    fontSize: 16,

    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

const BookListContainer = withTracker((props) => {

  const routeId = props.route.params.itemId;



  const handle = Meteor.subscribe('BooksAtLocation', routeId);

  return {
    listData: Books.find({coordinateId: routeId}).fetch(),
    loading: !handle.ready(),
    locationData: Coordinates.find({_id: routeId}).fetch()[0],
  };
})(BookList);

export default BookListContainer;
