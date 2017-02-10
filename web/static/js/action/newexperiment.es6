import Store from 'store/index.es6';
import ActionHelper from 'modules/redux-actions/index.es6';
import {actions as AppActions} from 'action/app.es6';
import {actions as ValidationErrorsActions} from 'action/validationerrors.es6';
import {actions as ExperimentsActions} from 'action/experiments.es6';
import API from 'modules/api/index.es6';
import config from 'config.es6';

const validate = data => {
  let errors = {};

  if (!data.name)
    errors.name = 'This field is required';

  if (!data.start_date)
    errors.start_date = 'This field is required';

  if (!data.end_date)
    errors.end_date = 'This field is required';

  if (!!data.max_users && isNaN(data.max_users))
    errors.max_users = 'Provide a valid number';
  
  if (!data.sampling_rate)
    errors.sampling_rate = 'This field is required';

  if (!data.description)
    errors.description = 'This field is required';

  return errors;
}

export const actions = ActionHelper.types([
  'SET_NEW_EXPERIMENT_VALUES',
  'RESET_NEW_EXPERIMENT'
]);

export default ActionHelper.generate({
  create(data, formName) {
    return async dispatch => {
      // Alright lets go, reset the validation errors
      dispatch({
        type: ValidationErrorsActions.RESET_VALIDATION_ERRORS,
        form: formName
      });

      const validationErrors = validate(data);
      if (Object.keys(validationErrors).length) {
        dispatch({
          type: ValidationErrorsActions.SET_VALIDATION_ERRORS,
          form: formName,
          errors: validationErrors
        });
        throw 'ValidationErrors';
      }

      return API.post(config.api.resources.experiments.POST, {experiment: data})
        .then(response => {
          response.json().then(json => {
            dispatch({
              type: ExperimentsActions.PUSH_TO_EXPERIMENTS,
              data: json.experiment
            });

            dispatch({
              type: AppActions.SET_APP_REDIRECT,
              path: `/experiments/${json.experiment.id}/edit`
            });
          });

          dispatch({type: actions.RESET_NEW_EXPERIMENT});
        });


    };
  },

  setValues(data) {
    return (dispatch) => {
      dispatch({
        type: actions.SET_NEW_EXPERIMENT_VALUES,
        data
      });
    };
  }
});
