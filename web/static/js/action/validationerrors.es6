import ActionHelper from 'modules/redux-actions/index.es6';

export const actions = ActionHelper.types([
  'SET_VALIDATION_ERRORS',
  'RESET_VALIDATION_ERRORS',
  'UNSET_VALIDATION_ERROR'
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

  unset(key, form) {
    return dispatch => {
      dispatch({
        type: 'UNSET_VALIDATION_ERROR',
        key,
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
