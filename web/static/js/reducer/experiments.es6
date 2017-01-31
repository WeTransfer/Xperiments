import {actions} from 'action/experiments';

export default function(state = {}, action) {
  const {type} = action;

  switch (type) {
    case actions.REFRESH_EXPERIMENTS:
      return {
        ...state
      };
  }

  return state;
}