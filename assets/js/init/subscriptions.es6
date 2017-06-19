import Store from 'store';
import Actions from 'action';
import {browserHistory} from 'react-router';

Store.subscribe(() => {
  const {app} = Store.getState();

  if (app.redirectPath !== null) {
    browserHistory.push(app.redirectPath);
    Store.dispatch(Actions.App.resetRedirectPath());
  }
});