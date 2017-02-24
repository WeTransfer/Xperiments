import Store from 'store/index.es6';
import ActionHelper from 'modules/redux-actions/index.es6';
import API from 'modules/api/index.es6';

import config from 'config.es6';

export const actions = ActionHelper.types([
  'FETCH_APPLICATIONS',
  'FETCHED_APPLICATIONS'
]);

export default ActionHelper.generate({
  list() {
    return async (dispatch, getState) => {
      dispatch({type: actions.FETCH_APPLICATIONS});

      API.get(config.api.resources.applications.GET)
        .then(response => {
          response.json().then(json => {
            dispatch({
              type: actions.FETCHED_APPLICATIONS,
              list: json.applications
            });
          });
        });
    };
  }
});
