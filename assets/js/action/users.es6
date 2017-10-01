import ActionHelper from 'modules/redux-actions';
import API from 'modules/api';

import config from 'config';

export const actions = ActionHelper.types([
  'FETCH_USERS',
  'FETCHED_USERS',
  'PUSH_TO_USERS'
]);

export default ActionHelper.generate({
  list() {
    return async dispatch => {
      dispatch({type: actions.FETCH_USERS});

      API.get(config.api.resources.users.GET)
        .then(response => {
          response.json().then(json => {
            dispatch({
              type: actions.FETCHED_USERS,
              list: json.users.reverse()
            });
          });
        });
    };
  }
});