import ActionHelper from 'modules/redux-actions/index.es6';
import API from 'modules/api/index.es6';

import config from 'config.es6';

export const actions = ActionHelper.types([
  'FETCH_EXCLUDABLE_EXPERIMENTS',
  'FETCHED_EXCLUDABLE_EXPERIMENTS'
]);

export default ActionHelper.generate({
  list() {
    return async dispatch => {
      dispatch({type: actions.FETCH_EXCLUDABLE_EXPERIMENTS});

      API.get(config.api.resources.experiments.GET)
        .then(response => {
          response.json().then(json => {
            dispatch({
              type: actions.FETCHED_EXCLUDABLE_EXPERIMENTS,
              list: json.experiments.reverse()
            });
          });
        });
    };
  }
});