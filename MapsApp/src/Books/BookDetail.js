import React, {useEffect, useState} from 'react';
import Meteor, {Mongo, withTracker} from '@meteorrn/core';
import PageForm from './PageForm'
import {format} from 'date-fns';
import {
  View,
  Button,
  Text,
  Dimensions,
  FlatList,
  Alert,
  Modal,
  TouchableHighlight,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Icon} from 'native-base';
import {VictoryLine, VictoryAxis, VictoryChart, VictoryTheme} from 'victory-native';

const Books = new Mongo.Collection('Books');
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;

function getColors(sentimentValue) {
  console.log(sentimentValue)
  if (sentimentValue > 0.5) {
    return {backgroundColor: 'rgba(0,255,0,0.7)',
    fontSize: 14,
    fontWeight: '400',
    color: '#383B41',
  }
  }
  else if (sentimentValue > 0 && sentimentValue < 0.5)
  {
    return {backgroundColor: 'rgba(0,0,255,0.7)',
    fontSize: 14,
    fontWeight: '400',
    color: '#383B41', }
  }
  else if (sentimentValue > -0.5 && sentimentValue < 0) {

    return {backgroundColor: 'rgba(255,0,0,0.7)',
    fontSize: 14,
    fontWeight: '400',
    color: '#383B41', }
  }
  else {
    return {backgroundColor: 'rgba(0,0,0,0.3)',
    fontSize: 14,
    fontWeight: '400',
    color: '#383B41',
  }
  }
}

function getSize(count) {
  return {fontSize: Number(count) * 10}
}

function BookDetail({route, navigation, bookData}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [pageData, setPageData] = useState({});
  const [sentimentData, setSentimentData] = useState([]);
  console.log(bookData);
  const {itemId} = route.params;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableHighlight
        style={styles.closeButton}
        onPress={() => {
          navigation.toggleDrawer()
        }}>
        <Icon
          name="menu-outline"
          style={{color: '#383B41', fontSize: 20}}></Icon>
      </TouchableHighlight>
     
      ),
    });
  }, [navigation]);

  useEffect(() => {
    console.log('timePoints', bookData)
    const lineData = function() { 
      if(bookData) {
      let data = []
      bookData.timePoints.map((datePoint) => {
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
  }, [bookData])


  useEffect(() => {
    setPageData(bookData);
    console.log(bookData);
  }, [bookData]);


  const BookInfo = ({item, index}) => {
    return (
      <View key={index} style={styles.item}>
        <View style={styles.headerText}>
          <Text style={styles.blueText}>Log {index + 1}</Text>
          <Text style={styles.datePosted}>
            {format(item.datePosted, 'MMMM do yyyy H:mm')}
          </Text>
        </View>

 
        <Text>
        {item.sentences.map((sentence) => 
          <Text style={getColors(sentence.score)}>{sentence.texts}</Text>
        )}
        </Text>
      </View>
    );
  };
  const PageItems = ({bookPages}) => {
    console.log(bookPages)
    if (Array.isArray(bookPages) && bookPages.length === 0 ) {
      return (
      
      <TouchableHighlight
      style={styles.openButton}
      onPress={() => {
        setModalVisible(true);
      }}>
      <Text style={styles.blueText}>Be the first to add a page</Text>
    </TouchableHighlight>
      
      )
    }
    else
    {
      return (
        <>
        <View style={styles.rightView}>
        <TouchableHighlight
      style={styles.entriesAdded}
      onPress={() => {
        setModalVisible(true);
      }}>
      <Text style={styles.blueText}>Add Page</Text>
    </TouchableHighlight>
  </View>
        <View style={styles.container}>
     
          <ScrollView
            horizontal={true}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}>
            {bookPages.map((item, index) => (
              <BookInfo item={item} index={index} />
            ))}
            <View style={styles.itemMiddle}>
            {bookData.wordCloud.map((item) => 
            <Text style={getSize(item.count)}>{item.word}</Text>
            )}
            </View>
            <View style={styles.chartContainer}>
            <Text style={styles.blueTextPad}>Sentiment Data</Text>
          <VictoryChart width={350} theme={VictoryTheme.material}>
            <VictoryLine
              data={sentimentData}
              style={{
                data: {stroke: '#445EE9'},
                parent: {border: '1px solid #6b717c'},
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
          </ScrollView>
          
        </View>
        
    </>
      );
    }
  
  };

  return (

    <View style={styles.container}>
    {Object.keys(pageData).length === 0 ?
      <Text>Loading</Text>
      :
      <PageItems bookPages={pageData.pages} />
    }
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
              <PageForm itemId={itemId} setModalVisible={setModalVisible} />
            </View>
          </View>
        </Modal>

      </View>
    {/*   <View style={styles.chartContainer}>
          <VictoryChart width={350} theme={VictoryTheme.material}>
            <VictoryLine
              data={sentimentData}
              style={{
                data: {stroke: '#445EE9'},
                parent: {border: '1px solid #6b717c'},
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
        </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    width: deviceWidth,
    padding: 0,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    

  },
  chart: {
    flex: 1,
  },
  rightView: {
    paddingLeft: 20,
    width: '100%',
    textAlign: 'right',
    alignContent: 'flex-end',
    alignContent: 'flex-end'
  },
  container: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#fff',
   
  },
  item: {
    flex: 1,

    padding: 20,
    flexDirection: 'column',
    width: deviceWidth,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  itemMiddle: {
    flex: 1,

    padding: 20,
    flexDirection: 'column',
    width: deviceWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePosted: {
    textTransform: 'uppercase',
    marginBottom: 5,
    fontSize: 16,
  },
  blueText: {
    color: '#445EE9',
    fontSize: 18,
    marginTop: 20,

    fontWeight: '700',


    marginBottom: 5,
  },
  blueTextPad: {
    color: '#445EE9',
    fontSize: 18,
    marginTop: 20,
    paddingLeft: 20,
    fontWeight: '700',


    marginBottom: 5,
  },
  headerText: {
    marginBottom: 40,
  },
  content: {
    
    fontSize: 14,
    fontWeight: '400',
    color: '#383B41',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
   
    marginTop: 50,
    width: deviceWidth,
    height: deviceHeight,
    backgroundColor: "white",
    borderRadius: 20,
 
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative'
 
  },
  openButton: {
  
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  entriesAdded: {

  },
  closeButton: {
    elevation: 2,
    color: '#383B41',
    position: "absolute",
    right: 10,
    top: 10,
    elevation: 3
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  firstPage: {
    marginTop: 20,
    textTransform: 'lowercase',
    fontWeight: '700',
    color: '#445EE9',
    fontSize: 16,
  },
  headerContainer: {
  
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between'
  }
});

const BookDetailContainer = withTracker((props) => {
  console.log(props.route.params.itemId);
  const routeId = props.route.params.itemId;

  const handle = Meteor.subscribe('BooksData', routeId);

  return {
    bookData: Books.findOne(routeId),
    loading: !handle.ready(),
  };
})(BookDetail);

export default BookDetailContainer;
