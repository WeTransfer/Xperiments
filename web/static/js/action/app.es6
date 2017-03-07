import ActionHelper from 'modules/redux-actions';

export const actions = ActionHelper.types([
  'SET_APP_REDIRECT',
  'RESET_APP_REDIRECT',
  'SET_APP_NOTIFICATION',
  'RESET_APP_NOTIFICATION'
]);

export default ActionHelper.generate({
  setRedirectPath(path) {
    return dispatch => {
      dispatch({
        type: actions.SET_APP_REDIRECT,
        path
      });
    };
  },

  resetRedirectPath() {
    return dispatch => {
      dispatch({type: actions.RESET_APP_REDIRECT});
    };
  },

  resetNotification() {
    return dispatch => {
      dispatch({type: actions.RESET_APP_NOTIFICATION});
    };
  }
});
