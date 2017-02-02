import * as Redux from 'redux';
import experiment from './experiment.es6';
import experiments from './experiments.es6';

export default Redux.combineReducers({
  experiment,
  experiments
});