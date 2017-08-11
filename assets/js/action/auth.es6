import ActionHelper from 'modules/redux-actions';

import API from 'modules/api';

import config from 'config';

export const actions = ActionHelper.types([
  'AUTH_CREATE',
  'AUTH_CREATE_SUCCESS',
  'SET_NEW_AUTH_VALUES'
]);

export default ActionHelper.generate({
  create(data) {
    return async (dispatch) => {
      dispatch({type: actions.AUTH_CREATE});

      try {
        const response = await API.post(config.api.resources.auth.POST, data);
        response.json().then(json => {
          dispatch({
            type: actions.AUTH_CREATE_SUCCESS,
            data: json.user
          });
        });
      } catch (e) {
        throw 'APIPostFailed';
      }
    };
  },

  setValues(data) {
    return (dispatch) => {
      dispatch({
        type: actions.SET_NEW_AUTH_VALUES,
        data
      });
    };
  }
});
