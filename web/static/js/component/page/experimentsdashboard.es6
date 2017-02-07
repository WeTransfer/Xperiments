import React from 'react';
import Store from 'store/index.es6';
import Actions from 'action/index.es6';
import {Link} from 'react-router';

import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

import CreateExperimentStepOne from 'containers/createexperiment/stepone.es6';
import VisibleExperimentsList from 'containers/visibleexperimentslist.es6';

const styles = {
  button: {
    margin: 12,
  }
};

export default class ExperimentsDashboardPage extends React.Component {
  state = {
    isCreateExperimentVisible: false
  };

  componentDidMount() {
    Store.dispatch(Actions.Experiments.list());
  }

  showCreateExperiment = () => {
    this.setState({
      isCreateExperimentVisible: true
    });
  }

  hideCreateExperiment = () => {
    this.setState({
      isCreateExperimentVisible: false
    });
  }

  render() {
    return <div className="page__expriments-dashboard">
      <RaisedButton label="create experiment" primary={true} style={styles.button} onTouchTap={this.showCreateExperiment} />
      <CreateExperimentStepOne isVisible={this.state.isCreateExperimentVisible} onClose={this.hideCreateExperiment} onSave={this.hideCreateExperiment} />
      <VisibleExperimentsList />
    </div>
  }
}
