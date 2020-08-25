import React, {useState} from 'react'
import Meteor, {Accounts} from '@meteorrn/core';
import SignIn from "./SignIn";
import Signup from "./Signup";

const LoginForm = ({navigation}) => {
    const [state, setState] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const toggleState = (state) => {
        const validStates = ["login", "signup"];
        const stateStr = state;
        if (validStates.includes(stateStr)) {
          setState(stateStr);
        }
      };

      const signup = () => {
          console.log('signing up')
          navigation.push('map')
      /*   if (!email || !email.length) {
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
        } */
  /*       Accounts.createUser({ email, password }, (e, r) => {
          if (e) setError(e.reason);
        }); */
      };
    
      const login = () => {
          console.log("logging in")
          navigation.push('map')
       /*  if (!email || !email.length) {
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
        }); */
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
          
        />
      );
}

export default LoginForm