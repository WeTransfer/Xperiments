import ActionHelper from 'modules/redux-actions/index.es6';

export const actions = ActionHelper.types([
  'SET_VALIDATION_ERRORS',
  'RESET_VALIDATION_ERRORS'
]);

export default ActionHelper.generate({
  set(errors, form) {
    return dispatch => {
      dispatch({
        type: 'SET_VALIDATION_ERRORS',
        errors,
        form
      });
    };
  },

  reset(form) {
    return dispatch => {
      dispatch({
        type: 'RESET_VALIDATION_ERRORS',
        form
      });
    };
  }
});
