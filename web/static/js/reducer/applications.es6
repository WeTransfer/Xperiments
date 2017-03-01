import {actions} from 'action/applications.es6';

export default function(state = {}, action) {
  const {type} = action;

  switch (type) {
    case actions.FETCH_APPLICATIONS:
      return {
        ...state,
        isFetching: true
      };

    case actions.FETCHED_APPLICATIONS:
      return {
        ...state,
        isFetching: false,
        list: action.list
      };
  }

  return state;
}