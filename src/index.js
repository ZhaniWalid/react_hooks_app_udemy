import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import AuthContextProvider from './context/auth-context';

ReactDOM.render(
  /* Wrap our <App /> with <AuthContextProvider /> 'Component' to listen to the 'Context' from everywhere in the app */
  <AuthContextProvider>
    <App />
  </AuthContextProvider>,
  document.getElementById('root')
);