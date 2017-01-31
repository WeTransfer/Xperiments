import ReactDOM from 'react-dom';
import React from 'react';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import Layout from 'component/layout.es6';
import NoMatch from 'component/page/nomatch.es6';
import CreateExperimentPage from 'component/page/createexperiment.es6';
import ExperimentsDashboardPage from 'component/page/experimentsdashboard.es6';

import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const App = () => {
  return  <Router history={browserHistory}>
    <Route path="/" component={Layout}>
      <IndexRoute component={ExperimentsDashboardPage} />
      <Route path="experiments" component={ExperimentsDashboardPage} />
      <Route path="experiments/create" component={CreateExperimentPage} />
    </Route>
  </Router>;
}

try {
  ReactDOM.render(
    <App />,
    document.querySelector('.root-node')
  );
} catch (e) {
}