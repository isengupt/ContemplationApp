import React from 'react';
import {
    StyleSheet,
    View,
    TextInput,
    Text,
    TouchableOpacity
  } from 'react-native'


const SignIn = ({ toggleState,
  email,
  setEmail,
  password,
  setPassword,
  login }) => {


  return (
    <View style={styles.container}>
    <Text style={styles.title}>SignIn</Text>
    <TextInput
          value={email}
          placeholder='email'
          style={styles.foodInput}
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          value={password}
          placeholder="password"
          style={styles.foodInput}
          onChangeText={text => setPassword(text)}
        />
         <TouchableOpacity
          style={{ marginBottom: 16 }}
          onPress={() =>
        event.stopPropagation() || event.preventDefault() || login()}>
          <Text style={{ fontSize: 22, color: '#5fc9f8' }}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginBottom: 16 }}
          onPress={(event) => event.preventDefault() || toggleState("signup")}>
          <Text style={{ fontSize: 22, color: '#5fc9f8' }}>Sign up Instead</Text>
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
    title: {
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

export default SignIn