import {actions} from 'action/app.es6';

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
  }

  return state;
}