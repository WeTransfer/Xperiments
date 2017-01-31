import Store from 'store';
import ActionHelper from 'redux-actions';

export const actions = ActionHelper.types([
  'REFRESH_EXPERIMENTS'
]);

export default ActionHelper.generate({
  // refreshExperiments() {
  //   // const pendingId = 'refreshUser';

  //   return async (dispatch) => {
  //     // dispatch(Pending.setPending(pendingId));

  //     // const response = await API.User.getCurrentUser();

  //     // if (response.status === 200) {
  //     //   dispatch({
  //     //     type: actions.REFRESH_USER,
  //     //     details: response.body
  //     //   });
  //     // } else {
  //     //   dispatch(Notification.setNotification('error', 'retrieve_account_exception'));
  //     // }

  //     // dispatch(Pending.resetPending(pendingId));
  //   };
  // }
});
