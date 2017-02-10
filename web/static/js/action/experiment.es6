import Store from 'store/index.es6';
import {actions as ValidationErrorsActions} from 'action/validationerrors.es6';
import {actions as AppActions} from 'action/app.es6';
import ActionHelper from 'modules/redux-actions/index.es6';
import API from 'modules/api/index.es6';

import config from 'config.es6';

const validateVariant = (data, variants = []) => {
  let errors = {};
  let totalAllocation = 0;
  try {
    totalAllocation = variants.reduce((a, b) => {
      return a.allocation + b.allocation;
    });
  } catch(e) {}
  let allocationLeft = 100 - totalAllocation;

  if (!data.name)
    errors.name = 'This field is required';
  if (!data.allocation)
    errors.allocation = 'This field is required';
  else if (isNaN(data.allocation))
    errors.allocation = 'Provide a valid number';
  else if (data.allocation > allocationLeft)
    errors.allocation = `Allocation can not be greater than 100% (${allocationLeft}% left)`;
  if (!data.payload) {
    errors.payload = 'This field is required';
  } else {
    try {
      JSON.parse(data.payload);
    } catch(e) {
      errors.payload = 'Provide a valid JSON, you can use http://pro.jsonlint.com/ to validate your changes';
    }
  }

  return errors;
};

export const actions = ActionHelper.types([
  'FETCH_EXPERIMENT',
  'FETCHED_EXPERIMENT',
  'UPDATE_EXPERIMENT',
  'UPDATED_EXPERIMENT',
  'SET_EXPERIMENT_VALUES',
  'SET_EXPERIMENT_VARIANT',
  'SET_EXPERIMENT_RULE',
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
      } catch(e) {
        throw 'APIGetFailed';
      }
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

  pushVariant(data, formName) {
    return (dispatch, getState) => {
      dispatch({
        type: ValidationErrorsActions.RESET_VALIDATION_ERRORS,
        form: formName
      });

      const validationErrors = validateVariant(data, getState().experiment.data.variants);
      if (Object.keys(validationErrors).length) {
        dispatch({
          type: ValidationErrorsActions.SET_VALIDATION_ERRORS,
          form: formName,
          errors: validationErrors
        });

        throw 'ValidationErrors';
      }

      dispatch({
        type: actions.SET_EXPERIMENT_VARIANT,
        data
      });
    }
  },

  pushRule(data, formName) {
    return dispatch => {
      dispatch({
        type: actions.SET_EXPERIMENT_RULE,
        data
      });
    }
  },

  pushExclusion(experimentId) {
    return dispatch => {
      dispatch({
        type: actions.SET_EXPERIMENT_EXCLUSION,
        experimentId
      });
    }
  },

  update(data) {
    return async (dispatch) => {
      dispatch({type: actions.UPDATE_EXPERIMENT});

      try {
        const response = await API.put(`${config.api.resources.experiments.GET}/${data.id}`, {experiment: data});
        if (response.status === 200) {
          response.json().then(json => {
            dispatch({
              type: actions.UPDATED_EXPERIMENT,
              data: json.experiment
            });

            dispatch({
              type: AppActions.SET_APP_REDIRECT,
              path: '/experiments/'
            });
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
      } catch(e) {
        throw 'APIPutFailed';
      }
    }
  }
});