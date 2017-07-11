import React from 'react';
import Store from 'store';
import Actions from 'action';

import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';

import CreateExperimentForm from 'containers/createexperiment';
import VisibleExperimentsList from 'containers/visibleexperimentslist';

const styling = {
  paper: {
    padding: 20,
    marginTop: 20
  },
  button: {
    marginTop: 20
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
      <div className="row">
        <div className="col-md-12">
          <div className="pull-right">
            <RaisedButton style={styling.button} label="create experiment" primary={true} onTouchTap={this.showCreateExperiment} />
          </div>
        </div>
        <div className="col-md-12">
          <Paper style={styling.paper} zDepth={1} rounded={false}>
            <VisibleExperimentsList title="Experiments" />
          </Paper>
        </div>
      </div>
      <CreateExperimentForm
        isVisible={this.state.isCreateExperimentVisible}
        onClose={this.hideCreateExperiment}
        onSave={this.hideCreateExperiment}
      />
    </div>;
  }
}
