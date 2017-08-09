import {actions} from 'action/users';

export default function(state = {}, action) {
  const {type} = action;
  let newList = null;

  switch (type) {
    case actions.FETCH_USERS:
    case actions.FETCH_USER:
      return {
        ...state,
        isFetching: true
      };

    case actions.FETCHED_USERS: {
      const indexedList = {};
      action.list.forEach(user => {
        indexedList[user.id] = user;
      });

      return {
        ...state,
        list: action.list,
        indexedList,
        isFetching: false
      };
    }

    case actions.PUSH_TO_USERS:
      newList = state.list;
      newList.push(action.data);
      return {
        ...state,
        list: newList
      };

    case actions.FILTER_USERS_BY_STATE:
      return {
        ...state,
        filter: action.state
      };

    case actions.FETCHED_USER:
      return {
        ...state,
        list: [action.list],
        isFetching: false
      };
  }

  return state;
}
