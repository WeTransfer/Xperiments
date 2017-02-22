import * as Redux from 'redux';
import Thunk from 'redux-thunk';
import Reducer from 'reducer/index.es6';

import app from './helper/app.es6';
import user from './helper/user.es6';
import applications from './helper/applications.es6';
import newexperiment from './helper/newexperiment.es6';
import experiment from './helper/experiment.es6';
import experiments from './helper/experiments.es6';
import excludableexperiments from './helper/excludableexperiments.es6';
import newvariant from './helper/newvariant.es6';
import newrule from './helper/newrule.es6';
import validationerrors from './helper/validationerrors.es6';

// Create our initial state
const initialState = {
  // This contains everything that is pending in our app is stored here
  app,
  user,
  applications,
  newexperiment,
  experiment,
  experiments,
  excludableexperiments,
  newvariant,
  newrule,
  validationerrors
};

// We'll create a Store that has our Reducers and an initial state,
// with added Thunk middleware to make async actions possible.
export default Redux.createStore(
  Reducer,
  initialState,
  Redux.applyMiddleware(Thunk)
);