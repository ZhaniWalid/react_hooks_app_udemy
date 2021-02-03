// 'useState' => Allows us to manage 'State & Functional Components'
import React, { useState } from 'react';

import Card from '../UI/Card';
import LoadingIndicator from '../UI/LoadingIndicator';
import './IngredientForm.css';

//* 'React HOOKS' => Allows us to use in all our work the 'functional Component' ( Exmple: 'const IngredientForm = React.memo(props => {....});' )
//* => AND there is no need to use the 'class based Component' ( Exmple; 'class IngredientForm extends Component {...}' )
//* => REQUIRE :: '@version — 16.8.0' => OR + for 'React version'

// React.'memo' => 'ONLY renders components' when the 'props' it depends on 'changed' 
//      AND NOT ALWAYS when the 'parent component changed'
const IngredientForm = React.memo(props => {
  //-- 'useState' => Allows us to manage 'State & Functional Components'
  //-- 'useState' => Return always an updated state of our elements ('title', 'amount')
  // const inputState = useState({title: '', amount: ''});
  // const [inputState, setInputState] = useState({title: '', amount: ''});
  
  //-- Split our 'State' in multiple 'States' => only use 'Objects / Arrays' as values for your 'State' => To manage 'Changes' easily
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredAmount, setEnteredAmount] = useState('');
  console.log('RENDERING INGREDIENT FORM');

  const submitHandler = event => {
    // preventDefault() => To 'prevent' the 'reloading of the page'
    event.preventDefault();
    props.onAddIngredient({ title: enteredTitle, amount: enteredAmount });
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input
              type="text"
              id="title"
              // value={inputState[0].title} // inputState[0] => Refer to our 'Current State Snapshot' [ inputState = useState({title: '', amount: ''}) ]
              value={enteredTitle}
              /* onChange={event => {
                const newTitle = event.target.value;
                // inputState[1](prevInputState => ({ // 'onChange' => this func will tell 'React' that we want to get the latest state that we set
                setInputState(prevInputState => ({
                  title: newTitle,
                  amount: prevInputState.amount // 'prevInputState' => To guarantee that we get the latest state at all times
                }));
              }} */ // inputState[1] => Update the 'State' by replacing the current 'State' with the 'title: event.target.value' + staying the 'amount: inputState[0].amount' as it's (to not loose it's value)
              onChange={event => {
                setEnteredTitle(event.target.value);
              }}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              // value={inputState[0].amount} // inputState[0] => Refer to our 'Current State Snapshot' [ inputState = useState({title: '', amount: ''}) ]
              value={enteredAmount}
              /* onChange={event => { 
                const newAmount = event.target.value;
                // inputState[1](prevInputState => ({ // 'onChange' => this func will tell 'React' that we want to get the latest state that we set
                setInputState(prevInputState => ({
                  amount: newAmount,
                  title: prevInputState.title // 'prevInputState' => To guarantee that we get the latest state at all times
                }));
              }} */ // inputState[1] => Update the 'State' by replacing the current 'State' with the 'amount: event.target.value' + staying the 'title: inputState[0].title' as it's (to not loose it's value)
              onChange={event => {
                setEnteredAmount(event.target.value);
              }}
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
            {props.loading && <LoadingIndicator />} {/* == {props.loading ? <LoadingIndicator /> : null} */}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;