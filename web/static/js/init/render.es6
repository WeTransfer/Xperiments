import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import Store from 'store/index.es6';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import LayoutContainer from 'containers/layout.es6';
import EditExperimentPageContainer from 'containers/editexperimentpage.es6';
import ExperimentsDashboardPage from 'component/page/experimentsdashboard.es6';

import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

ReactDOM.render(
  <Provider store={Store}>
    <Router history={browserHistory}>
      <Route path="/" component={LayoutContainer}>
        <IndexRoute component={ExperimentsDashboardPage} />
        <Route path="experiments" component={ExperimentsDashboardPage} />
        <Route path="experiments/:experimentId/edit" component={EditExperimentPageContainer} />
      </Route>
    </Router>
  </Provider>,
  document.querySelector('.root-node')
);