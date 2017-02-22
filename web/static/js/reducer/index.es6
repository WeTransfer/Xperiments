import * as Redux from 'redux';
import app from './app.es6';
import user from './user.es6';
import applications from './applications.es6';
import newexperiment from './newexperiment.es6';
import experiment from './experiment.es6';
import experiments from './experiments.es6';
import excludableexperiments from './excludableexperiments.es6';
import newvariant from './newvariant.es6';
import newrule from './newrule.es6';
import validationerrors from './validationerrors.es6';

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