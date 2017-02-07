import ActionHelper from 'modules/redux-actions/index.es6';

export const actions = ActionHelper.types([
  'SET_APP_REDIRECT',
  'RESET_APP_REDIRECT'
]);

export default ActionHelper.generate({
  setRedirectPath(path) {
    return (dispatch, getState) => {
      dispatch({
        type: 'SET_APP_REDIRECT',
        path
      });
    };
  },

  resetRedirectPath() {
    return (dispatch, getState) => {
      dispatch({type: 'RESET_APP_REDIRECT'});
    };
  }
});
