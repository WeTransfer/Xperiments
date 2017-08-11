import * as Redux from 'redux';
import app from './app';
import user from './user';
import applications from './applications';
import newexperiment from './newexperiment';
import experiment from './experiment';
import experiments from './experiments';
import excludableexperiments from './excludableexperiments';
import newvariant from './newvariant';
import newrule from './newrule';
import validationerrors from './validationerrors';
import users from './users';
import newuser from './newuser';
import auth from './auth';

export default Redux.combineReducers({
  auth,
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
});
