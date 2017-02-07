import Store from 'store/index.es6';
import ActionHelper from 'modules/redux-actions/index.es6';
import API from 'modules/api/index.es6';

import config from 'config.es6';

export const actions = ActionHelper.types([
  'FETCH_EXPERIMENTS',
  'FETCHED_EXPERIMENTS',
  'FETCH_EXPERIMENT',
  'FETCHED_EXPERIMENT',
  'PUSH_TO_EXPERIMENTS'
]);

export default ActionHelper.generate({
  list() {
    return async (dispatch, getState) => {
      dispatch({type: actions.FETCH_EXPERIMENTS});

      API.get(config.api.resources.experiments.GET)
        .then(response => {
          response.json().then(json => {
            dispatch({
              type: actions.FETCHED_EXPERIMENTS,
              list: json.experiments
            });
          });
        });
    }
  },

  get(id) {
    return async (dispatch, getState) => {
      dispatch({type: actions.FETCH_EXPERIMENT});

      API.get(`${config.api.resources.experiments.GET}/${id}`)
        .then(response => {
          response.json().then(json => {
            dispatch({
              type: actions.FETCHED_EXPERIMENT,
              list: json.experiment
            });
          });
        });
    }
  }
});