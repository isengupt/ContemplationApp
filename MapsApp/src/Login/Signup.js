import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  TextInput,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Directions} from 'react-native-gesture-handler';
import {
  Container,
  Content,
  Form,
  Input,
  Item,
  Label,
  Icon,
  Button,
} from 'native-base';

const Signup = ({
  toggleState,
  email,
  setEmail,
  password,
  setPassword,
  setConfirmPassword,
  confirmPassword,
  error,
  signup,
}) => {
  return (
<Container>
      <Content style={styles.content}>
        <Form>
          <Text style={styles.title}>
            Welcome back
            {'\n'}
            <Text style={styles.blueText}>Writer!</Text>
          </Text>
          <Item
            floatingLabel
            success={email.length > 5}
            style={email.length > 5 ? styles.inputBorderGreen : styles.inputs}>
            <Label style={styles.label}>Email</Label>
            <Input
              style={styles.inputItem}
              value={email}
              autoCorrect={false}
              onChangeText={(text) => setEmail(text)}
            />

            <Icon
              style={styles.icon}
              name={email.length > 5 ? 'checkmark-circle' : ''}
            />
          </Item>
          <Item
            floatingLabel
            success={password.length > 5}
            style={
              password.length > 5 ? styles.inputBorderGreen : styles.inputs
            }>
            <Label style={styles.label}>Password</Label>
            <Input
              style={styles.inputItem}
              value={password}
              secureTextEntry={true} 
              placeholder="password"
              onChangeText={(text) => setPassword(text)}
            />
            <Icon
              style={styles.icon}
              name={password.length > 5 ? 'checkmark-circle' : ''}
            />
          </Item>

<Item
            floatingLabel
            success={confirmPassword.length > 5}
            style={
              confirmPassword.length > 5 ? styles.inputBorderGreen : styles.inputs
            }>
            <Label style={styles.label}>Confirm Password</Label>
            <Input
              style={styles.inputItem}
              value={confirmPassword}
              secureTextEntry={true} 
              placeholder="confirm password"
              onChangeText={(text) => setConfirmPassword(text)}
            />
            <Icon
              style={styles.icon}
              name={confirmPassword.length > 5 ? 'checkmark-circle' : ''}
            />
          </Item>

  

<Button
            style={styles.LoginButton}
            block
            onPress={(event) =>
              event.stopPropagation() || event.preventDefault() || signup()
            }>
            <Text style={styles.LoginText}>Signup</Text>
          </Button>


    

          <View style={styles.AccountsBottom}>
            <Text>Already have an Account?</Text>
            <TouchableOpacity
              style={{marginBottom: 16}}
              onPress={(event) =>
                event.preventDefault() || toggleState('login')
              }>
              <Text style={styles.blueText}>Login here.</Text>
            </TouchableOpacity>
          </View>
      </Form>
      <View style={styles.errorContainer}>
      <Text style={styles.error}>{error}</Text>
      </View>
      </Content>
    </Container>

  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight || 0,
    fontFamily: 'Avenir',
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    flexDirection: 'column',
    width: '100%',
  },
errorContainer: {
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center'
},
  error: {
    color: 'red'
  },
  ForgotPassword: {
    marginBottom: 20,
    flex: 1,
    alignItems: 'flex-end',
  },
  LoginText: {
    fontWeight: '700',
    textTransform: 'uppercase',
    fontSize: 14,
    color: '#fff',
  },
  ForgotText: {
    color: '#445EE9',
    fontSize: 13,
  },
  inputItem: {
    paddingTop: 10,
    marginBottom: 5,
  },
  content: {
    padding: 25,
    paddingTop: 35,
  },
  LoginButton: {
    position: 'relative',
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#445EE9',
  },
  blueText: {
    marginLeft: 5,
    color: '#445EE9',
  },
  inputs: {
    color: '#383B41',
    fontSize: 14,
    marginLeft: 0,
    paddingLeft: 0,
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    marginBottom: 20,
  },
  AccountsBottom: {
    fontSize: 13,
    marginTop: 10,
    flex: 1,
    color: '#383B41',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
  },
  inputBorderGreen: {
    color: '#383B41',
    fontSize: 14,
    marginLeft: 0,
    paddingLeft: 0,
    borderColor: '#67D863',
    marginBottom: 10,
  },
  inputBorderDark: {
    borderColor: '#383B41',
  },
  title: {
    fontSize: 34,
    fontWeight: '600',
    marginBottom: 30,
    color: '#383B41',
  },
  icon: {
    color: '#67D863',
  },
});

export default Signup;
