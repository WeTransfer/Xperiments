import Store from 'store/index.es6';
import ActionHelper from 'modules/redux-actions/index.es6';
import API from 'modules/api/index.es6';
import config from 'config.es6';

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
  }
});
