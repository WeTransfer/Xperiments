import {actions} from 'action/validationerrors.es6';

export default function(state = {}, action) {
  const {type} = action;
  let newData = {};

  switch (type) {
    case actions.SET_VALIDATION_ERRORS:
      newData = Object.assign({}, state);
      newData[action.form] = action.errors;
      return {
        ...state,
        ...newData
      };

    case actions.RESET_VALIDATION_ERRORS:
      newData = Object.assign({}, state);
      newData[action.form] = {};
      return {
        ...state,
        ...newData
      };
  }

  return state;
}