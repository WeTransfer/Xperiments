import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import Store from 'store/index.es6';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import Layout from 'component/layout.es6';
import NoMatch from 'component/page/nomatch.es6';
import EditExperimentPage from 'component/page/editexperiment.es6';
import ExperimentsDashboardPage from 'component/page/experimentsdashboard.es6';

import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

ReactDOM.render(
  <Provider store={Store}>
    <Router history={browserHistory}>
      <Route path="/" component={Layout}>
        <IndexRoute component={ExperimentsDashboardPage} />
        <Route path="experiments" component={ExperimentsDashboardPage} />
        <Route path="experiments/:experimentId/edit" component={EditExperimentPage} />
      </Route>
    </Router>
  </Provider>,
  document.querySelector('.root-node')
);