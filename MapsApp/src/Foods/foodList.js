import React, {Component} from 'react';
import {StyleSheet, FlatList, Text, View, Button} from 'react-native';
import {connect} from 'react-redux';
import {deleteFood} from '../actions/food';

class FoodList extends Component {
  static navigationOptions = {
    title: 'Food List',
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: '#845cc3',
    },
  };

  render() {
    return (
      <FlatList
        style={styles.listContainer}
        data={this.props.foods}
        keyExtractor={(item, index) => item.key.toString()}
        renderItem={(data) => (
          <View style={{justifyContent: 'center', marginBottom: 10}}>
            <Text
              style={{
                backgroundColor: 'blue',
                color: 'white',
                padding: 10,
                flex: 1
              }}>
              {data.item.name}
            </Text>

            <Button
              style={{fontSize: 20, color: 'green'}}
              styleDisabled={{color: 'red'}}
              onPress={() => this.props.delete(data.item.key)}
              title="Press Me">
              Delete
            </Button>
          </View>
        )}
      />
    );
  }
}

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: '#dce2ff',
    padding: 16,
  },
  listText: {
    fontSize: 30,
  },
});

const mapStateToProps = (state) => {
  console.log(state);
  return {
    foods: state.foodReducer.foodList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    delete: (key) => dispatch(deleteFood(key)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FoodList);
