import React, {useState, useEffect} from 'react'
import Meteor, {Accounts} from '@meteorrn/core';
import SignIn from "./SignIn";
import Signup from "./Signup";
import validate from "validate.js";



const LoginForm = ({navigation}) => {
    const [state, setState] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailSuccess, setEmailSuccess] = useState(false)
    const [passwordSuccess, setPasswordSuccess] = useState(false)
    const [error, setError] = useState("")
    const user = Meteor.user();

    useEffect(() => {
      console.log(user)
      if (user) {
        navigation.push('map')
      }
    }, [user])

    const toggleState = (state) => {
        const validStates = ["login", "signup"];
        const stateStr = state;
        if (validStates.includes(stateStr)) {
          setState(stateStr);
        }
      };

      const pwTest = (password) => {
        if (password.length < 8) {
          return false;
        } else if (password.search(/\d/) == -1) {
          return false;
        } else if (password.search(/[a-zA-Z]/) == -1) {
          return false;
        }
        // non alphanumeric character
        else if (password.search(/[^0-9a-zA-Z]/) == -1) {
          return false;
        }
    
        return true;
      };

      const signup = () => {
         
         if (!email || !email.length) {
          setError("You need to enter your email");
          return;
        }
        let hasEmail = validate.single(email, { presence: true, email: true });
        if (hasEmail) {
          setError("The email " + hasEmail[0]);
          return;
        }
    
        if (!password || !password.length) {
          setError("You need to enter your password");
          return;
        }
        if (!pwTest(password)) {
          setError(
            "Password must contain at least 8 characters, 1 letter, 1 number, and 1 special character (e.g: <code>!&*$</code>)"
          );
    
          return;
        }
        if (!confirmPassword || !confirmPassword.length) {
          setError("You need to confirm your password");
          return;
        }
        if (password !== confirmPassword) {
          setError("Passwords don't match");
          return;
        } 

         Accounts.createUser({ email, password }, (e, r) => {
          if (e) setError(e.reason);
          else {
            Meteor.call('createProfile', email, function (err, res) {
              if (err) {
                console.log(err);
              } else {
                console.log(res, 'success!');
                console.log('signing up')
                navigation.push('map')
              }
            });
          }
        }); 
      };
    
      const login = () => {
          console.log("logging in")
        
        if (!email || !email.length) {
          setError("You need to enter your email");
          return;
        }
        let hasEmail = validate.single(email, { presence: true, email: true });
        if (hasEmail) {
          setError("The email " + hasEmail[0]);
          return;
        }
        if (!password || !password.length) {
          setError("You need to enter your password");
          return;
        }
    
        Meteor.loginWithPassword(email, password, (e, r) => {
          if (e) {
            if (e.reason === "There was a problem with your login")
              setError("Wrong credentials. Please check your password.");
            else setError(e.reason);
          }
          else {
            navigation.push('map')
          }
        }); 
      };

      if (state === "login")
      return (
        <SignIn
          toggleState={toggleState}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
          confirmPassword={confirmPassword}
          login={login}
          error={error}
        

        />
      );
    if (state === "signup")
      return (
        <Signup
          toggleState={toggleState}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          setConfirmPassword={setConfirmPassword}
          confirmPassword={confirmPassword}
          signup={signup}
          error={error}
          
        />
      );
}

export default LoginForm