// 'useState' => Allows us to manage 'State & Functional Components'
import React, { useState } from 'react';

//* 'React HOOKS' => Allows us to use in all our work the 'functional Component' ( Exmple: 'const IngredientForm = React.memo(props => {....});' )
//* => AND there is no need to use the 'class based Component' ( Exmple; 'class IngredientForm extends Component {...}' )
//* => REQUIRE :: '@version — 16.8.0' => OR + for 'React version'


// Context lets us pass a value deep into the component tree
// without explicitly threading it through every component.
// Create a context for the current 'AuthContext' (with "{isAuth,login}" as the default).
export const AuthContext = React.createContext({
  isAuth: false,
  login: () => {}
});

const AuthContextProvider = props => {
  //-- 'useState' => Allows us to manage 'State & Functional Components'
  //-- 'useState' => Return always an updated state of our elements ('isAuthenticated')
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const loginHandler = () => {
    setIsAuthenticated(true);
  };

  return (
    /* Context.'Provider' => Every Context object comes with a 'Provider React component'... 
          ...=> that allows 'consuming components' to 'subscribe to context changes'. */
    <AuthContext.Provider
      value={{ login: loginHandler, isAuth: isAuthenticated }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;