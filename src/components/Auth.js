import React, { useContext } from 'react';

import Card from './UI/Card';
import { AuthContext } from '../context/auth-context';
import './Auth.css';

const Auth = props => {
  // Accepts a context object (the value returned from React.createContext) and returns the current context value,
  //  ...as given by the nearest context provider for the given context.
  const authContext = useContext(AuthContext);

  const loginHandler = () => {
    // 'login()' => from 'const AuthContext' on [auth-context.js] file
    authContext.login();
  };

  return (
    <div className="auth">
      <Card>
        <h2>You are not authenticated!</h2>
        <p>Please log in to continue.</p>
        <button onClick={loginHandler}>Log In</button>
      </Card>
    </div>
  );
};

export default Auth;