import Store from 'store/index.es6';
import ActionHelper from 'modules/redux-actions/index.es6';
import API from 'modules/api/index.es6';

import config from 'config.es6';

export const actions = ActionHelper.types([
  'FETCH_EXPERIMENTS',
  'FETCHED_EXPERIMENTS',
  'PUSH_TO_EXPERIMENTS',
  'FILTER_EXPERIMENTS_BY_STATE',
  'UPDATE_EXPERIMENT_STATE',
  'UPDATED_EXPERIMENT_STATE',
  'DELETE_EXPERIMENT',
  'DELETED_EXPERIMENT'
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
              list: json.experiments.reverse()
            });
          });
        });
    };
  },

  filter(state) {
    return dispatch => {
      dispatch({
        type: actions.FILTER_EXPERIMENTS_BY_STATE,
        state
      });
    };
  },

  startExperiment(experimentId) {
    return this.updateState(experimentId, {event: 'run'});
  },
  
  stopExperiment(experimentId) {
    return this.updateState(experimentId, {event: 'stop'});
  },
  
  terminateExperiment(experimentId) {
    return this.updateState(experimentId, {event: 'terminate'});
  },

  deleteExperiment(experimentId) {
    return async (dispatch, getState) => {
      dispatch({
        type: actions.DELETE_EXPERIMENT,
        data: {
          experimentId
        }
      });

      API.delete(`${config.api.resources.experiments.GET}/${experimentId}`)
        .then(response => {
          response.json().then(json => {
            dispatch({
              type: actions.DELETED_EXPERIMENT,
              data: {
                experimentId
              }
            });
          });
        });
    };
  },

  updateState(experimentId, data) {
    return async (dispatch) => {
      dispatch({
        type: actions.UPDATE_EXPERIMENT_STATE,
        data: {
          experimentId
        }
      });

      try {
        const response = await API.put(`${config.api.resources.experiments.GET}/${experimentId}/state`, data);
        if (response.status === 200) {
          response.json().then(json => {
            dispatch({
              type: actions.UPDATED_EXPERIMENT_STATE,
              data: {
                experimentId,
                state: json.state
              }
            });
          });
        } else {
          dispatch({
            type: AppActions.SET_APP_NOTIFICATION,
            notificationData: {
              type: 'error',
              message: 'There was an error updating the experiment state, please try again'
            }
          });
        }
      } catch(e) {
        throw 'APIPutFailed';
      }
    }
  }
});