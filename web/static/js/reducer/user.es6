import {actions} from 'action/user';

export default function(state = {}, action) {
  const {type} = action;

  switch (type) {
    case actions.SET_APPLICATION:
      return {
        ...state,
        selectedApplication: action.applicationId
      };
  }

  return state;
}