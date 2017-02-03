import {actions} from 'action/experiment.es6';

export default function(state = {}, action) {
  const {type} = action;

  switch (type) {
    case actions.CREATE_EXPERIMENT:
      return {
        ...state
      };

    case actions.SET_VALUES:
      return {
        ...state,
        ...action.data
      };
  }

  return state;
}