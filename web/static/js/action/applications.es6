import Store from 'store/index.es6';
import ActionHelper from 'modules/redux-actions/index.es6';

export const actions = ActionHelper.types([
  'FETCH_APPLICATIONS',
  'FETCHED_APPLICATIONS'
]);

export default ActionHelper.generate({
  list() {
    return async (dispatch, getState) => {
      dispatch({type: actions.FETCH_APPLICATIONS});

      dispatch({
        type: actions.FETCHED_APPLICATIONS,
        list: [
          {id: 1, name: 'Web'},
          {id: 2, name: 'iOS'},
          {id: 3, name: 'Android'},
          {id: 4, name: 'Desktop App'}
        ]
      });
    };
  }
});
