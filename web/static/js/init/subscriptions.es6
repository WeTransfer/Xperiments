import Store from 'store/index.es6';
import Actions from 'action/index.es6';
import {browserHistory} from 'react-router';

Store.subscribe(() => {
  const {app} = Store.getState();

  if (app.redirectPath !== null) {
    browserHistory.push(app.redirectPath);
    Store.dispatch(Actions.App.resetRedirectPath());
  }
});