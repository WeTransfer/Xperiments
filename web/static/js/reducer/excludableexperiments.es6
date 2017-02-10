import {actions} from 'action/excludableexperiments.es6';

export default function(state = {}, action) {
  const {type} = action;

  switch (type) {
    case actions.FETCH_EXCLUDABLE_EXPERIMENTS:
      return {
        ...state,
        isFetching: true
      };

    case actions.FETCHED_EXCLUDABLE_EXPERIMENTS:
      return {
        ...state,
        list: action.list,
        isFetching: false
      };
  }

  return state;
}