import {actions} from 'action/experiment.es6';

export default function(state = {}, action) {
  const {type} = action;

  switch (type) {
    case actions.FETCH_EXPERIMENT:
      return {
        ...state,
        isFetching: true
      };

    case actions.FETCHED_EXPERIMENT:
      return {
        ...state,
        data: action.data,
        isFetching: false
      };

    case actions.UPDATE_EXPERIMENT:
      return {
        ...state,
        isUpdating: true
      };

    case actions.UPDATED_EXPERIMENT:
      return {
        ...state,
        data: action.data,
        isUpdating: false
      };

    case actions.SET_EXPERIMENT_VALUES:
      return {
        ...state,
        ...action.data
      };
  }

  return state;
}