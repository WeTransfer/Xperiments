import ActionHelper from 'modules/redux-actions/index.es6';

export const actions = ActionHelper.types([
  'SET_APPLICATION'
]);

export default ActionHelper.generate({
  setApplication(id) {
    return async dispatch => {
      dispatch({
        type: actions.SET_APPLICATION,
        applicationId: id
      });
    };
  }
});
