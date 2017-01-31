import * as Redux from 'redux';
import Thunk from 'redux-thunk';
import Reducer from 'reducer';

// Create our initial state
const initialState = {
  // This contains everything that is pending in our app is stored here
};

// We'll create a Store that has our Reducers and an initial state,
// with added Thunk middleware to make async actions possible.
export default Redux.createStore(
  Reducer,
  initialState,
  Redux.applyMiddleware(Thunk)
);