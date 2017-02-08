import {actions} from 'action/experiment.es6';

export default function(state = {}, action) {
  const {type} = action;
  let newData = {};

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
        data: Object.assign({}, state.data, action.data)
      };

    case actions.SET_EXPERIMENT_VARIANT:
      newData = Object.assign({}, state.data);
      newData.variants = newData.variants.concat(action.data);
      return {
        ...state,
        data: newData
      };

    case actions.SET_EXPERIMENT_RULE:
      newData = Object.assign({}, state.data);
      newData.rules = newData.rules.concat(action.data);
      return {
        ...state,
        data: newData
      };

    case actions.SET_EXPERIMENT_EXCLUSION:
      newData = Object.assign({}, state.data);
      newData.exclusions.push(action.experimentId);
      return {
        ...state,
        data: newData
      };
  }

  return state;
}