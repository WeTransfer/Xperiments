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

export default Redux.combineReducers({
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
});