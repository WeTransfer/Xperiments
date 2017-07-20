import ActionHelper from 'modules/redux-actions';
import {actions as AppActions} from 'action/app';
import {actions as ValidationErrorsActions} from 'action/validationerrors';
import {actions as UsersActions} from 'action/users';
import API from 'modules/api';
import config from 'config';

import validators from 'helper/validators';

const validate = data => {
  let errors = {};

  if (!data.name) {
    errors.name = ['This field is required'];
  }

  if (!data.email) {
    errors.email = ['This field is required'];
  } else if (!validators.isEmail(data.email)) {
    errors.email = ['Provide a valid email'];
  }

  if (!data.role) {
    errors.role = ['This field is required'];
  }

  return errors;
};

export const actions = ActionHelper.types([
  'SET_NEW_USER_VALUES',
  'RESET_NEW_USER'
]);

export default ActionHelper.generate({
  create(data, formName) {
    return async (dispatch, getState) => {
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

      const {user} = getState();
      data.user_id = user.id;

      const response = await API.post(config.api.resources.users.POST, {user: data});
      if (response.status === 201) {
        response.json().then(json => {
          dispatch({
            type: UsersActions.PUSH_TO_USERS,
            data: json.user
          });
        });

        dispatch({type: actions.RESET_NEW_USER});

        dispatch({
          type: AppActions.SET_APP_NOTIFICATION,
          notificationData: {
            type: 'info',
            message: `${data.name} (${data.email}) was added!`
          }
        });
        return;
      } else if (response.status === 422) {
        response.json().then(json => {
          // Additionally show validation errors in the forms
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
      }
    };
  },

  setValues(data) {
    return (dispatch) => {
      dispatch({
        type: actions.SET_NEW_USER_VALUES,
        data
      });
    };
  }
});
