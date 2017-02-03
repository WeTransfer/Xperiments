import {actions} from 'action/experiment.es6';
import initialExperimentState from 'store/helper/experiment.es6';

export default function(state = {}, action) {
  const {type} = action;

  switch (type) {
    case actions.CREATE_EXPERIMENT:
      return {
        ...state
      };

    case actions.SET_EXPERIMENT_VALUES:
      return {
        ...state,
        ...action.data
      };

    case actions.RESET_EXPERIMENT:
      return {
        ...initialExperimentState
      };
  }

  return state;
}