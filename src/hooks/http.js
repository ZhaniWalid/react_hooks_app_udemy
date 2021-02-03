//-- 'useCallback' => will return a 'memoized' version of the 'callback' that only 'changes' if 'one of the inputs has changed'.
//--- 'useReducer' => take some 'inputs' & return some 'outputs' => To find a clear way when the 'state changes' in the 'state updates'
//---     => HAS NO CONNECTION TO THE 'REDUX LIBRARY' (REDUCER)
import { useReducer, useCallback } from 'react';

//* 'React HOOKS' => Allows us to use in all our work the 'functional Component' ( Exmple: 'const IngredientForm = React.memo(props => {....});' )
//* => AND there is no need to use the 'class based Component' ( Exmple; 'class IngredientForm extends Component {...}' )
//* => REQUIRE :: '@version — 16.8.0' => OR + for 'React version'

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null
};

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier
      };
    case 'RESPONSE':
      return {
        //// '...' (= Spread Operator) => Copy & Distribute the entire old 'curHttpState' => keeping other properties 
        ////     + Adding to them the new elements (like=> 'loading: false' (will override the old value)) to this new array
        ...curHttpState,
        loading: false,
        data: action.responseData,
        extra: action.extra
      };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return initialState;
    default:
      throw new Error('Should not be reached!');
  }
};

// Build our own 'Hook' for the 'http' requests
const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);
  const clear = useCallback(() => dispatchHttp({ type: 'CLEAR' }), []);
  
  const sendRequest = useCallback((url, method, body, reqExtra, reqIdentifer) => {
      dispatchHttp({ type: 'SEND', identifier: reqIdentifer });
      fetch(url, {
        method: method,
        body: body,
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          return response.json();
        })
        .then(responseData => {
          dispatchHttp({
            type: 'RESPONSE',
            responseData: responseData,
            extra: reqExtra
          });
        })
        .catch(error => {
          dispatchHttp({
            type: 'ERROR',
            errorMessage: 'Something went wrong!'
          });
        });
    }, []);

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest,
    reqExtra: httpState.extra,
    reqIdentifer: httpState.identifier,
    clear: clear
  };
};

export default useHttp;