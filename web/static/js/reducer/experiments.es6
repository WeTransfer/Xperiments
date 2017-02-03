import {actions} from 'action/experiments.es6';

export default function(state = {}, action) {
  const {type} = action;

  switch (type) {
    case actions.FETCH_EXPERIMENTS:
      return {
        ...state,
        isFetching: true
      };

    case actions.FETCHED_EXPERIMENTS:
      return {
        ...state,
        list: action.list,
        isFetching: false
      };
  }

  return state;
}