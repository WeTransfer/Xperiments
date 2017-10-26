import {actions} from 'action/auth';

export default function(state = {}, action) {
  const {type} = action;

  switch (type) {
    case actions.SET_NEW_AUTH_VALUES:
      return {
        ...state,
        ...action.data
      };

    case actions.AUTH_CREATE:
      return {
        ...state,
        creating: true
      };

    case actions.AUTH_CREATE_SUCCESS:
      return {
        ...state,
        creating: false,
        created: true
      };
  }

  return state;
}