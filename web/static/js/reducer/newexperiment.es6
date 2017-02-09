import {actions} from 'action/newexperiment.es6';
import initialExperimentState from 'store/helper/newexperiment.es6';

export default function(state = {}, action) {
  const {type} = action;

  switch (type) {
    case actions.SET_NEW_EXPERIMENT_VALUES:
      return {
        ...state,
        ...action.data
      };

    case actions.RESET_NEW_EXPERIMENT:
      return {
        ...initialExperimentState
      };
  }

  return state;
}