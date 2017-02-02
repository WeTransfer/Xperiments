import React from 'react';
import Store from 'store/index.es6';
import Actions from 'action/index.es6';
import {Link} from 'react-router';

import RaisedButton from 'material-ui/RaisedButton';

import ExperimentsTable from 'component/experimentstable.es6';

const styles = {
  button: {
    margin: 12,
  }
};

export default class ExperimentsDashboardPage extends React.Component {
  componentDidMount() {
    Store.subscribe(this.render);
    Store.dispatch(Actions.Experiments.list());
  }

  render() {
    const {experiments} = Store.getState();

    return <div className="page__expriments-dashboard">
      <Link to="/experiments/create"><RaisedButton label="create experiment" primary={true} style={styles.button} /></Link>
      {experiments.list.length ? <ExperimentsTable experiments={experiments.list} /> : null}
    </div>
  }
}
