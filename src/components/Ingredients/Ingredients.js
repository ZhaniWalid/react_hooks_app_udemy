// 'useState' => Allows us to manage 'State & Functional Components'
//- The 'useEffect()' Hook => lets you perform side effects in 'function Components'
//- ==> Similar to 'componentDidMount' and 'componentDidUpdate' in a 'class based Component'
//-- 'useCallback' => will return a 'memoized' version of the 'callback' that only 'changes' => if 'one of the inputs has changed'.
//--- 'useReducer' => take some 'inputs' & return some 'outputs' => To find a clear way when the 'state changes' in the 'state updates'
//---     => HAS NO CONNECTION TO THE 'REDUX LIBRARY' (REDUCER)
//---- 'useMemo' => will only 'recompute' the 'memoized value' when one of the deps has changed. => To memorize a value
//----    => ONLY RECALCULATE 'Component' when you NEED to RECALCULATE it
import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http'; // Importing our own 'Hook' for the 'http' requests

//* 'React HOOKS' => Allows us to use in all our work the 'functional Component' ( Exmple: 'const IngredientForm = React.memo(props => {....});' )
//* => AND there is no need to use the 'class based Component' ( Exmple; 'class IngredientForm extends Component {...}' )
//* => REQUIRE :: '@version — 16.8.0' => OR + for 'React version'

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      // '...' (= Spread Operator) => Copy & Distribute the entire old 'currentIngredients' 
      //     => keeping other properties + Adding to them the new elements ('action.ingredient') to this new array
      return [...currentIngredients, action.ingredient];
    case 'DELETE':
      // Return our 'updated' list of ingredients
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Should not get there!');
  }
};

const Ingredients = () => {
  //-- 'useState' => Allows us to manage 'State & Functional Components'
  //-- 'useState' => Return always an updated state of our elements ('title', 'amount')
  //-- Split our 'State' in multiple 'States' => only use 'Objects / Arrays' as values for your 'State' => To manage 'Changes' easily
  /* const [userIngredients, setUserIngredients ] = useState([]); // old one
  const [isLoading, setIsLoading] = useState(false); // old one
  const [error, setError] = useState(); // old one */

  // 'dispatchHttp' => we use it to 'dispatch' the action objects in the 'switch (action.type)...' 
  //  ..on 'const httpReducer' which are then handled by the 'reducer'
  //// const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null}); // old one

  // 'dispatch' => we use it to 'dispatch' the action objects in the 'switch (action.type)...' 
  //  ..on 'const ingredientReducer' which are then handled by the 'reducer'
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  // These properties are defined in the last 'return', in our own 'useHttp()' 'Hook' for the 'http' requests on [http.js] file 
  const { isLoading, error, data, sendRequest, reqExtra, reqIdentifer, clear } = useHttp();

  // NOT NEEDED => Because we already 'fetch' our 'Data' by default in the 'useEffect()' on [Search.js] file when 'filter == null | != null'
  /* useEffect(() => {
     // '.json' => to work correctly with 'Firebase Database Mapping'
     fetch('https://reactjs-reacthooks-app-udemy.firebaseio.com/ingredients.json')
      .then(response => response.json())
      .then(responseData => {
        const loadedIngredients = [];
        for (const key in responseData) {
          loadedIngredients.push({
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount
          });
        }
        setUserIngredients(loadedIngredients);
      }); 
  }, []);  */ // with '[]' as a 2nd arg => 'useEffect()' acts like 'componentDidMount' -> it's run ONLY ONCE (after the 1st render) -> to AVOID looping without infinite on calling 'const Ingredients' 

  // The 'useEffect()' Hook => lets you perform side effects in 'function Components'
  // ==> Similar to 'componentDidMount' and 'componentDidUpdate' in a 'class based Component'
  useEffect(() => {
    if (!isLoading && !error && reqIdentifer === 'REMOVE_INGREDIENT') {
      dispatch({ type: 'DELETE', id: reqExtra });
    } else if (!isLoading && !error && reqIdentifer === 'ADD_INGREDIENT') {
      dispatch({
        type: 'ADD',
        // '...' (= Spread Operator) => Copy & Distribute the entire old 'reqExtra' 
        //     => keeping other properties + Adding to them the new elements ('id: data.name') to this new array 'ingredient'
        ingredient: { id: data.name, ...reqExtra }
      });
    }
  }, [data, reqExtra, reqIdentifer, isLoading, error]);

  //-- 'useCallback' => will return a 'memoized' version of the 'callback' that only 'changes' if 'one of the inputs has changed'.
  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    // case: " action.type === 'SET' " on 'const ingredientReducer (currentIngredients == type: 'SET', action == ingredients: filteredIngredients)
    dispatch({ type: 'SET', ingredients: filteredIngredients });
  }, []);

  // old one
  /* const addIngredientHandler = useCallback(ingredient => {
    //// setIsLoading(true);
    // case: " action.type === 'SEND' " on 'const httpReducer (X)'
    dispatchHttp({type: 'SEND'});
     // '.json' => to work correctly with 'Firebase Database Mapping'
    fetch('https://reactjs-reacthooks-app-udemy.firebaseio.com/ingredients.json', {
      method: 'POST',
      // JSON.'stringify()' => Converts a 'JavaScript value' to a 'JavaScript Object Notation (JSON)' string.
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      //// setIsLoading(false);
      // case: " action.type === 'RESPONSE' " on 'const httpReducer (X)'
      dispatchHttp({type: 'RESPONSE'});
      return response.json();
    }).then(responseData => {
      //// '...' (= Spread Operator) => Copy & Distribute the entire old 'prevIngredients' => keeping other properties + Adding to them the new elements to this new array
      // setUserIngredients(prevIngredients => [
      //   ...prevIngredients,
      //   // responseData.'name' => the 'name' is a property that we got from the 'Firebase response'
      //   { id: responseData.name, ...ingredient } 
      // ]);

      // case: " action.type === 'ADD' " on 'const ingredientReducer (currentIngredients == type: 'ADD', action == ingredients: { id: responseData.name, ...ingredient })
      dispatch({ type: 'ADD', ingredients: { id: responseData.name, ...ingredient } });
    });
  }, []); */

  //-- 'useCallback' => will return a 'memoized' version of the 'callback' that only 'changes' if 'one of the inputs has changed'.
  const addIngredientHandler = useCallback(ingredient => {
    // sendRequest(url, method, body, reqExtra, reqIdentifer) => Defined on [http.js] file
    sendRequest(
      // '.json' => to work correctly with 'Firebase Database Mapping'
      'https://reactjs-reacthooks-app-udemy.firebaseio.com/ingredients.json',
      'POST',
      // JSON.'stringify()' => Converts a 'JavaScript value' to a 'JavaScript Object Notation (JSON)' string.
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
    );
  }, [sendRequest] );

  // old one
  /* const removeIngredientHandler = useCallback(ingredientId => {
    //// setIsLoading(true);
    // case: " action.type === 'SEND' " on 'const httpReducer (X)'
    dispatchHttp({type: 'SEND'});
    fetch(`https://reactjs-reacthooks-app-udemy.firebaseio.com/ingredients/${ingredientId}.json`, {
      method: 'DELETE'
    }).then(response => {
      //// setIsLoading(false);
      // case: " action.type === 'RESPONSE' " on 'const httpReducer (X)'
      dispatchHttp({type: 'RESPONSE'});

      //// if 'ingredient.id' !== 'ingredientId' (the id of ingredient that we want to delete it) => return true
      // setUserIngredients(prevIngredients => 
      //   prevIngredients.filter((ingredient) => ingredient.id !== ingredientId 
      // ));

      // case: " action.type === 'DELETE' " on 'const ingredientReducer (currentIngredients == type: 'DELETE', action == id: ingredientId)
      dispatch({ type: 'DELETE', id: ingredientId});
    }).catch(error => {
      //// setError('Something went wrong!');
      //// setIsLoading(false);

      // case: " action.type === 'ERROR' " on 'const httpReducer (curHttpState=='ERROR' , action== errorMessage: 'Something went wrong!')'
      dispatchHttp({type: 'ERROR', errorMessage: 'Something went wrong!'});
    });
  }, []); */

  //-- 'useCallback' => will return a 'memoized' version of the 'callback' that only 'changes' if 'one of the inputs has changed'.
  const removeIngredientHandler = useCallback(
    ingredientId => {
      // sendRequest(url, method, body, reqExtra, reqIdentifer) => Defined on [http.js] file
      sendRequest(
        // '.json' => to work correctly with 'Firebase Database Mapping'
        `https://reactjs-reacthooks-app-udemy.firebaseio.com/ingredients/${ingredientId}.json`,
        'DELETE',
        null,
        ingredientId,
        'REMOVE_INGREDIENT'
      );
    }, [sendRequest] );

  //---- 'useMemo' => will only 'recompute' the 'memoized value' when one of the deps has changed. => To memorize a value
  //---- ...ONLY RECALCULATE 'Component' when you NEED to RECALCULATE it
  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
    // [userIngredients, removeIngredientHandler] => we specifed them as our 'dependencies' 
    //    => This only will re-run this effect [useEffect()] => if 'userIngredients' OR/ 'removeIngredientHandler' changed
  }, [userIngredients, removeIngredientHandler]); // this func will execute whenever 'userIngredients' / 'removeIngredientHandler' changes

  return (
    <div className="App">
      {/* 'clear', 'error' & 'isLoading' => from our own 'useHttp()' 'Hook' above, for the 'http' requests */}
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>} {/* == {error ? <ErrorModal onClose={clear}>{error}</ErrorModal> : null} */}

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;