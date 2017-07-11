import {actions} from 'action/newuser';
import initialUserState from 'store/helper/newuser';

export default function(state = {}, action) {
  const {type} = action;

  switch (type) {
    case actions.SET_NEW_USER_VALUES:
      return {
        ...state,
        ...action.data
      };

    case actions.RESET_NEW_USER:
      return {
        ...initialUserState
      };
  }

  return state;
}
