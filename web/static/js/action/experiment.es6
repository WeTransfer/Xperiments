import {actions as ValidationErrorsActions} from 'action/validationerrors.es6';
import {actions as AppActions} from 'action/app.es6';
import ActionHelper from 'modules/redux-actions/index.es6';
import API from 'modules/api/index.es6';

import config from 'config.es6';

export const actions = ActionHelper.types([
  'FETCH_EXPERIMENT',
  'FETCHED_EXPERIMENT',
  'UPDATE_EXPERIMENT',
  'UPDATED_EXPERIMENT',
  'UPDATE_EXPERIMENT_FAILED',
  'SET_EXPERIMENT_VALUES',
  'SET_EXPERIMENT_VARIANT',
  'UPDATE_EXPERIMENT_VARIANT',
  'POP_EXPERIMENT_VARIANT',
  'SET_EXPERIMENT_RULE',
  'POP_EXPERIMENT_RULE',
  'SET_EXPERIMENT_EXCLUSION'
]);

export default ActionHelper.generate({
  get(id) {
    return async (dispatch) => {
      dispatch({type: actions.FETCH_EXPERIMENT});

      try {
        const response = await API.get(`${config.api.resources.experiments.GET}/${id}`);
        response.json().then(json => {
          dispatch({
            type: actions.FETCHED_EXPERIMENT,
            data: json.experiment
          });
        });
      } catch (e) {
        throw 'APIGetFailed';
      }
    };
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
    };
  },

  updateVariant(newData, variant) {
    return dispatch => {
      dispatch({
        type: actions.UPDATE_EXPERIMENT_VARIANT,
        newData,
        variant
      });
    };
  },

  popVariant(variant) {
    return dispatch => {
      dispatch({
        type: actions.POP_EXPERIMENT_VARIANT,
        variant
      });
    };
  },

  pushRule(data) {
    return dispatch => {
      dispatch({
        type: actions.SET_EXPERIMENT_RULE,
        data
      });
    };
  },

  popRule(rule) {
    return dispatch => {
      dispatch({
        type: actions.POP_EXPERIMENT_RULE,
        rule
      });
    };
  },

  pushExclusion(experimentId) {
    return dispatch => {
      dispatch({
        type: actions.SET_EXPERIMENT_EXCLUSION,
        experimentId
      });
    };
  },

  update(data, formName) {
    return async (dispatch) => {
      dispatch({type: actions.UPDATE_EXPERIMENT});
      dispatch({
        type: ValidationErrorsActions.RESET_VALIDATION_ERRORS,
        form: formName
      });

      try {
        const response = await API.put(`${config.api.resources.experiments.GET}/${data.id}`, {experiment: data});
        if (response.status === 200) {
          response.json().then(json => {
            dispatch({
              type: actions.UPDATED_EXPERIMENT,
              data: json.experiment
            });

            // dispatch({
            //   type: AppActions.SET_APP_REDIRECT,
            //   path: '/experiments/'
            // });

            dispatch({
              type: AppActions.SET_APP_NOTIFICATION,
              notificationData: {
                type: 'info',
                message: `${json.experiment.name} was updated`
              }
            });
          });
          return;
        } else if (response.status === 422) {
          response.json().then(json => {
            const validationErrors = json.errors;
            if (Object.keys(validationErrors).length) {
              dispatch({
                type: ValidationErrorsActions.SET_VALIDATION_ERRORS,
                form: formName,
                errors: validationErrors
              });
              throw 'ValidationErrors';
            }
          });
        } else {
          dispatch({
            type: AppActions.SET_APP_NOTIFICATION,
            notificationData: {
              type: 'error',
              message: 'There was an error updating your experiment, please try again.'
            }
          });
        }

        dispatch({type: actions.UPDATE_EXPERIMENT_FAILED});
      } catch (e) {
        throw 'APIPutFailed';
      }
    };
  }
});