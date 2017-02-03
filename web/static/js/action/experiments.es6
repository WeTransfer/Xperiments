import Store from 'store/index.es6';
import ActionHelper from 'modules/redux-actions/index.es6';

export const actions = ActionHelper.types([
  'FETCH_EXPERIMENTS',
  'FETCHED_EXPERIMENTS'
]);

export default ActionHelper.generate({
  list() {
    return async (dispatch, getState) => {
      dispatch({type: actions.FETCH_EXPERIMENTS});

      dispatch({
        type: actions.FETCHED_EXPERIMENTS,
        list: [
          {id: 1, name: 'experiment 1', variants: [], isActive: true, startDate: '', endDate: ''},
          {id: 2, name: 'experiment 2', variants: [], isActive: true, startDate: '', endDate: ''},
          {id: 3, name: 'experiment 3', variants: [], isActive: true, startDate: '', endDate: ''},
          {id: 4, name: 'experiment 4', variants: [], isActive: true, startDate: '', endDate: ''},
          {id: 5, name: 'experiment 5', variants: [], isActive: true, startDate: '', endDate: ''},
          {id: 6, name: 'experiment 6', variants: [], isActive: true, startDate: '', endDate: ''}
        ]
      });
    };
  }
});
