import {actions} from 'action/experiments.es6';

export default function(state = {}, action) {
  const {type} = action;

  switch (type) {
    case actions.FETCH_EXPERIMENTS:
    case actions.FETCH_EXPERIMENT:
      return {
        ...state,
        isFetching: true
      };

    case actions.FETCHED_EXPERIMENTS:
      const indexedList = {};
      action.list.forEach(experiment => {
        indexedList[experiment.id] = experiment;
      });

      return {
        ...state,
        list: action.list,
        indexedList,
        isFetching: false
      };

    case actions.FETCHED_EXPERIMENT:
      return {
        ...state,
        list: [action.list],
        isFetching: false
      };

    case actions.PUSH_TO_EXPERIMENTS:
      let newList = state.list;
      newList.push(action.data);
      return {
        ...state,
        list: newList
      };
  }

  return state;
}