import {actions} from 'action/experiments.es6';

export default function(state = {}, action) {
  const {type} = action;
  let newList = null;

  switch (type) {
    case actions.FETCH_EXPERIMENTS:
    case actions.FETCH_EXPERIMENT:
      return {
        ...state,
        isFetching: true
      };

    case actions.FETCHED_EXPERIMENTS: {
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
    }

    case actions.FILTER_EXPERIMENTS_BY_STATE:
      return {
        ...state,
        filter: action.state
      };

    case actions.FETCHED_EXPERIMENT:
      return {
        ...state,
        list: [action.list],
        isFetching: false
      };

    case actions.PUSH_TO_EXPERIMENTS:
      newList = state.list;
      newList.push(action.data);
      return {
        ...state,
        list: newList
      };

    case actions.UPDATE_EXPERIMENT_STATE:
      return {
        ...state,
        isUpdatingState: action.data.experimentId
      };

    case actions.UPDATED_EXPERIMENT_STATE:
      newList = state.list.map(experiment => {
        if (experiment.id === action.data.experimentId) {
          return Object.assign({}, experiment, {state: action.data.state});
        }
        return experiment;
      });
      return {
        ...state,
        isUpdatingState: false,
        list: newList
      };

    case actions.UPDATE_EXPERIMENT_STATE_FAILED:
      return {
        ...state,
        isUpdatingState: false
      };

    case actions.DELETE_EXPERIMENT:
      return {
        ...state,
        isDeleting: action.data.experimentId
      };

    case actions.DELETED_EXPERIMENT:
      newList = state.list.map(experiment => {
        if (experiment.id !== action.data.experimentId)
          return experiment;
      });
      return {
        ...state,
        isDeleting: false,
        list: newList
      };
  }

  return state;
}