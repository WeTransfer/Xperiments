import * as Redux from 'redux';
import Thunk from 'redux-thunk';
import Reducer from 'reducer';

import app from './helper/app';
import user from './helper/user';
import applications from './helper/applications';
import newexperiment from './helper/newexperiment';
import experiment from './helper/experiment';
import experiments from './helper/experiments';
import excludableexperiments from './helper/excludableexperiments';
import newvariant from './helper/newvariant';
import newrule from './helper/newrule';
import validationerrors from './helper/validationerrors';
import users from './helper/users';
import newuser from './helper/newuser';

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
  validationerrors,
  users,
  newuser
};

// We'll create a Store that has our Reducers and an initial state,
// with added Thunk middleware to make async actions possible.
export default Redux.createStore(
  Reducer,
  initialState,
  Redux.applyMiddleware(Thunk)
);
