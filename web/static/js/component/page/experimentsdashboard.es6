import React from 'react';
import Store from 'store/index.es6';
import Actions from 'action/index.es6';
import {Link} from 'react-router';

import RaisedButton from 'material-ui/RaisedButton';

import VisibleExperimentsList from 'containers/visibleexperimentslist.es6';

const styles = {
  button: {
    margin: 12,
  }
};

export default class ExperimentsDashboardPage extends React.Component {
  componentDidMount() {
    Store.dispatch(Actions.Experiments.list());
  }

  render() {
    return <div className="page__expriments-dashboard">
      <Link to="/experiments/create"><RaisedButton label="create experiment" primary={true} style={styles.button} /></Link>
      <VisibleExperimentsList />
    </div>
  }
}
