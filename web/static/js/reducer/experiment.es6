import {actions} from 'action/experiment.es6';

export default function(state = {}, action) {
  const {type} = action;

  switch (type) {
    case actions.CREATE_EXPERIMENT:
      return {
        ...state
      };

    case actions.RESET_SUCCESS:
      return {
        ...state
      };
  }

  return state;
}