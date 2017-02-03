import Store from 'store/index.es6';
import ActionHelper from 'modules/redux-actions/index.es6';

export const actions = ActionHelper.types([
  'CREATE_EXPERIMENT',
  'SET_VALUES'
]);

export default ActionHelper.generate({
  create() {
    return async (dispatch, getState) => {
      dispatch({
        type: actions.CREATE_EXPERIMENT
      });
    };
  },

  setValues(data) {
    return (dispatch, getState) => {
      dispatch({
        type: actions.SET_VALUES,
        data
      });
    };
  }
});
