import ActionHelper from 'modules/redux-actions/index.es6';
import {actions as ValidationErrorsActions} from 'action/validationerrors.es6';

const validate = data => {
  let errors = {};

  if (!data.parameter)
    errors.parameter = ['This field is required'];

  if (!data.type)
    errors.type = ['This field is required'];

  if (!data.operator)
    errors.operator = ['This field is required'];

  if (!data.value)
    errors.value = ['This field is required'];

  return errors;
};

export const actions = ActionHelper.types([
  'SET_NEW_RULE_VALUES',
  'RESET_NEW_RULE'
]);

export default ActionHelper.generate({
  setValues(data) {
    return dispatch => {
      dispatch({
        type: actions.SET_NEW_RULE_VALUES,
        data
      });
    };
  },

  reset() {
    return dispatch => {
      dispatch({
        type: actions.RESET_NEW_RULE
      });
    };
  },

  validate(data, formName) {
    return dispatch => {
      const validationErrors = validate(data);

      if (Object.keys(validationErrors).length) {
        dispatch({
          type: ValidationErrorsActions.SET_VALIDATION_ERRORS,
          form: formName,
          errors: validationErrors
        });
        throw 'ValidationErrors';
      }
    };
  }
});
