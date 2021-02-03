import React, { useContext } from 'react';

import Ingredients from './components/Ingredients/Ingredients';
import Auth from './components/Auth';
import { AuthContext } from './context/auth-context';

const App = props => {
  // Accepts a context object (the value returned from React.createContext) and returns the current context value,
  //  ...as given by the nearest context provider for the given context.
  const authContext = useContext(AuthContext);

  let content = <Auth />;
  // 'isAuth' => from 'const AuthContext' on [auth-context.js] file
  if (authContext.isAuth) {
    content = <Ingredients />;
  }

  return content;
};

export default App;