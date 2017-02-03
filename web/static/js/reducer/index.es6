import * as Redux from 'redux';
import user from './user.es6';
import applications from './applications.es6';
import experiment from './experiment.es6';
import experiments from './experiments.es6';

export default Redux.combineReducers({
  user,
  applications,
  experiment,
  experiments
});