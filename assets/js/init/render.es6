import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import Store from 'store';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import LayoutContainer from 'containers/layout';
import AuthContainer from 'containers/auth';
import EditExperimentPageContainer from 'containers/editexperimentpage';
import ExperimentsDashboardPage from 'component/page/experimentsdashboard';
import UsersDashboardPage from 'component/page/usersdashboard';

import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

let layoutChildren = [
  <IndexRoute component={ExperimentsDashboardPage} />,
  <Route path="users" component={UsersDashboardPage} />,
  <Route path="experiments" component={ExperimentsDashboardPage} />,
  <Route path="experiments/:experimentId/edit" component={EditExperimentPageContainer} />
];

// Oh no! User is not logged in.
// Load Auth container
const {user} = Store.getState();
if (!user.id) {
  layoutChildren = [
    <Route path="auth/login" component={AuthContainer} />
  ];
}

ReactDOM.render(
  <Provider store={Store}>
    <Router history={browserHistory}>
      <Route path="/" component={LayoutContainer}>
        {layoutChildren}
      </Route>
    </Router>
  </Provider>,
  document.querySelector('.root-node')
);
