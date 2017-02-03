import * as Redux from 'redux';
import Thunk from 'redux-thunk';
import Reducer from 'reducer/index.es6';

import user from './helper/user.es6';
import applications from './helper/applications.es6';
import experiment from './helper/experiment.es6';
import experiments from './helper/experiments.es6';

// Create our initial state
const initialState = {
  // This contains everything that is pending in our app is stored here
  user,
  applications,
  experiment,
  experiments
};

// We'll create a Store that has our Reducers and an initial state,
// with added Thunk middleware to make async actions possible.
export default Redux.createStore(
  Reducer,
  initialState,
  Redux.applyMiddleware(Thunk)
);