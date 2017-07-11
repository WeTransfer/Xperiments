import {actions} from 'action/app';

export default function(state = {}, action) {
  const {type} = action;

  switch (type) {
    case actions.SET_APP_REDIRECT:
      return {
        ...state,
        redirectPath: action.path
      };

    case actions.RESET_APP_REDIRECT:
      return {
        ...state,
        redirectPath: null
      };

    case actions.SET_APP_NOTIFICATION:
      return {
        ...state,
        notificationData: action.notificationData
      };

    case actions.RESET_APP_NOTIFICATION:
      return {
        ...state,
        notificationData: null
      };
  }

  return state;
}