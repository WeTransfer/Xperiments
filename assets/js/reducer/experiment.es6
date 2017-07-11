import {actions} from 'action/experiment';

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

    case actions.UPDATE_EXPERIMENT_FAILED:
      return {
        ...state,
        isUpdating: false
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

    case actions.SET_EXPERIMENT_VARIANT: {
      let variant = action.data;
      if (typeof variant.payload === 'object')
        variant.payload = JSON.stringify(variant.payload);

      newData = Object.assign({}, state.data);
      newData.variants = newData.variants.concat(variant);
      return {
        ...state,
        data: newData
      };
    }

    case actions.UPDATE_EXPERIMENT_VARIANT: {
      newData = Object.assign({}, state.data);
      let indexOfVariant = newData.variants.indexOf(action.variant);
      if (indexOfVariant !== -1) {
        if (typeof action.newData.payload === 'object')
          action.newData.payload = JSON.stringify(action.newData.payload);
        
        newData.variants[indexOfVariant] = Object.assign({}, newData.variants[indexOfVariant], action.newData);
      }
      return {
        ...state,
        data: newData
      };
    }

    case actions.POP_EXPERIMENT_VARIANT:
      newData = Object.assign({}, state.data);
      if (newData.variants.indexOf(action.variant) !== -1)
        newData.variants.splice(newData.variants.indexOf(action.variant), 1);
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

    case actions.POP_EXPERIMENT_RULE:
      newData = Object.assign({}, state.data);
      if (newData.rules.indexOf(action.rule) !== -1)
        newData.rules.splice(newData.rules.indexOf(action.rule), 1);
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