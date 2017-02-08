import Store from 'store/index.es6';
import ActionHelper from 'modules/redux-actions/index.es6';
import API from 'modules/api/index.es6';

import config from 'config.es6';

export const actions = ActionHelper.types([
  'FETCH_EXPERIMENT',
  'FETCHED_EXPERIMENT',
  'UPDATE_EXPERIMENT',
  'UPDATED_EXPERIMENT',
  'SET_EXPERIMENT_VALUES',
  'SET_EXPERIMENT_VARIANT',
  'SET_EXPERIMENT_RULE'
]);

export default ActionHelper.generate({
  get(id) {
    return async (dispatch) => {
      dispatch({type: actions.FETCH_EXPERIMENT});

      API.get(`${config.api.resources.experiments.GET}/${id}`)
        .then(response => {
          response.json().then(json => {
            dispatch({
              type: actions.FETCHED_EXPERIMENT,
              data: json.experiment
            });
          });
        });
    }
  },

  setValues(data) {
    return (dispatch) => {
      dispatch({
        type: actions.SET_EXPERIMENT_VALUES,
        data
      });
    };
  },

  pushVariant(data) {
    return dispatch => {
      dispatch({
        type: actions.SET_EXPERIMENT_VARIANT,
        data
      });
    }
  },

  pushRule(data) {
    return dispatch => {
      dispatch({
        type: actions.SET_EXPERIMENT_RULE,
        data
      });
    }
  },

  update(data) {
    return async (dispatch) => {
      dispatch({type: actions.UPDATE_EXPERIMENT});

      API.put(`${config.api.resources.experiments.GET}/${data.id}`, {experiment: data})
        .then(response => {
          response.json().then(json => {
            dispatch({
              type: actions.UPDATED_EXPERIMENT,
              data: json.experiment
            });
          });
        });
    }
  }
});