// 'useState' => Allows us to manage 'State & Functional Components'
//- The 'useEffect()' Hook => lets you perform side effects in 'function Components'
//- ==> Similar to 'componentDidMount' and 'componentDidUpdate' in a 'class based Component'
//-- 'useRef' =>  returns a mutable ref object whose .current property is initialized to the passed argument (initialValue).
//--    => The returned object will persist for the full lifetime of the component. => Creates a 'Reference'
import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';
import './Search.css';

//* 'React HOOKS' => Allows us to use in all our work the 'functional Component' ( Exmple: 'const IngredientForm = React.memo(props => {....});' )
//* => AND there is no need to use the 'class based Component' ( Exmple; 'class IngredientForm extends Component {...}' )
//* => REQUIRE :: '@version — 16.8.0' => OR + for 'React version'

// React.'memo' => 'ONLY renders components' when the 'props' it depends on 'changed' 
//      AND NOT ALWAYS when the 'parent component changed'
const Search = React.memo(props => {
  // const { X } = Y; => This is an 'Object Distructure' --> Means that we want to extract properties from 'Y' & Store them on 'X'
  const { onLoadIngredients } = props;
  // 'useState' => Allows us to manage 'State & Functional Components'
  const [enteredFilter, setEnteredFilter] = useState('');
  //-- 'useRef' =>  returns a mutable ref object whose .current property is initialized to the passed argument (initialValue).
  //--    => The returned object will persist for the full lifetime of the component. => Creates a 'Reference'
  const inputRef = useRef();
  // These properties are defined in the last 'return', in our own 'useHttp()' 'Hook' for the 'http' requests on [http.js] file
  const { isLoading, data, error, sendRequest, clear } = useHttp();

  // The 'useEffect()' Hook => lets you perform side effects in 'function Components'
  // ==> Similar to 'componentDidMount' and 'componentDidUpdate' in a 'class based Component'
  useEffect(() => {
    const timer = setTimeout(() => {
      // if the 'current value currently entered in the input' is the 'same' as the 'entered value'
      // => like this we know that the 'value hasn't changed in between' or at least 'the same as it at the beginning of the timer'
      if (enteredFilter === inputRef.current.value) {
        // Query to be sent to 'Firebase' (it's understood by 'Firebase')
        const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
        sendRequest(
          // '.json' => to work correctly with 'Firebase Database Mapping'
          'https://reactjs-reacthooks-app-udemy.firebaseio.com/ingredients.json' + query,
          'GET'
        );
      }
    }, 500);  // 500ms = 0.5s
    // We just want to measure the changes from the latest keystroke => Do a 'cleanup' 
    return () => {
      // if the 'dependencies == null' (= []) => the 'cleanup' func runs when the 'Component get Unmounted'
      clearTimeout(timer);
    };
     // [enteredFilter, inputRef, sendRequest] => we specifed them as our 'dependencies' 
    //    => This only will re-run this effect [useEffect()] => if 'sendRequest' OR/ 'enteredFilter' changed
  }, [enteredFilter, inputRef, sendRequest]); // this func will execute whenever 'enteredFilter' / 'sendRequest' changes

  // The 'useEffect()' Hook => lets you perform side effects in 'function Components'
  // ==> Similar to 'componentDidMount' and 'componentDidUpdate' in a 'class based Component'
  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngredients = [];
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        });
      }
      onLoadIngredients(loadedIngredients); // 'onLoadIngredients' => Extracted from 'props': 'const { onLoadIngredients } = props'
    }
    // [data, isLoading, error, onLoadIngredients] => we specifed them as our 'dependencies' 
    //    => This only will re-run this effect [useEffect()] => if 'onLoadIngredients' changed
  }, [data, isLoading, error, onLoadIngredients]);

  return (
    <section className="search">
      {/* 'clear', 'isLoading' & 'error' => from our own 'useHttp()' 'Hook' above, for the 'http' requests */}
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>} {/* == {error ? <ErrorModal onClose={clear}>{error}</ErrorModal> : null} */}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span>} {/* == {isLoading ? <span>Loading...</span> : null} */}
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={event => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;