import ActionHelper from 'modules/redux-actions';
import API from 'modules/api';
import {actions as AppActions} from 'action/app';

import config from 'config';
import Helper from 'helper';

export const actions = ActionHelper.types([
  'FETCH_EXPERIMENTS',
  'FETCHED_EXPERIMENTS',
  'PUSH_TO_EXPERIMENTS',
  'FILTER_EXPERIMENTS_BY_STATE',
  'UPDATE_EXPERIMENT_STATE',
  'UPDATED_EXPERIMENT_STATE',
  'UPDATE_EXPERIMENT_STATE_FAILED',
  'DELETE_EXPERIMENT',
  'DELETED_EXPERIMENT'
]);

export default ActionHelper.generate({
  list() {
    return async dispatch => {
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
    return async dispatch => {
      dispatch({
        type: actions.DELETE_EXPERIMENT,
        data: {
          experimentId
        }
      });

      API.delete(`${config.api.resources.experiments.GET}/${experimentId}`)
        .then(() => {
          dispatch({
            type: actions.DELETED_EXPERIMENT,
            data: {
              experimentId
            }
          });
        });
    };
  },

  updateState(experimentId, data) {
    return async dispatch => {
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

          dispatch({
            type: AppActions.SET_APP_NOTIFICATION,
            notificationData: {
              type: 'info',
              message: 'experiment was updated'
            }
          });
          return;
        }

        // Validation errors
        response.json().then(json => {
          if (response.status === 422) {
            let message = Helper.makeErrorMessage(json);
            dispatch({
              type: AppActions.SET_APP_NOTIFICATION,
              notificationData: {
                type: 'error',
                title: 'Errors',
                message: message || 'There was an error updating the experiment state, please try again'
              }
            });
          }
        });

        dispatch({type: actions.UPDATE_EXPERIMENT_STATE_FAILED});

        throw 'ValidationErrors';
      } catch (e) {
        throw 'APIPutFailed';
      }
    };
  }
});