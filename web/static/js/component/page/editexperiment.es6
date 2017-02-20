import React from 'react';
import Store from 'store/index.es6';
import Actions from 'action/index.es6';
import {Link} from 'react-router';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import AddExperiment from 'component/forms/createexperiment/addexperiment.es6';
import Rules from 'component/forms/createexperiment/rules.es6';
import Variants from 'component/forms/createexperiment/variants.es6';
import Exclusions from 'component/forms/createexperiment/exclusions.es6';

const styling = {
  paper: {
    padding: 20,
    marginTop: 30
  },
  button: {
    flat: {
      marginRight: 10
    }
  }
};

export default class EditExperimentPage extends React.Component {
  static propTypes = {
    selectedApplication: React.PropTypes.object,
    experiment: React.PropTypes.object,
    indexedExperimentsList: React.PropTypes.object,
    save: React.PropTypes.func,
    deleteRule: React.PropTypes.func,
    deleteVariant: React.PropTypes.func,
    setName: React.PropTypes.func,
    setStartDate: React.PropTypes.func,
    setStartTime: React.PropTypes.func,
    setEndDate: React.PropTypes.func,
    setEndTime: React.PropTypes.func,
    setDescription: React.PropTypes.func,
    setMaxUsers: React.PropTypes.func,
    setSamplingRate: React.PropTypes.func,
    validationErrors: React.PropTypes.object
  };

  componentWillMount() {
    Store.dispatch(Actions.Experiment.get(this.props.params.experimentId));
    Store.dispatch(Actions.Experiments.list());
  }

  handleClickOnSave = () => {
    this.props.save(this.props.experiment.data);
  }

  render() {
    if (this.props.experiment.isFetching === undefined || this.props.experiment.isFetching === true)
      return null;

    if (['running', 'terminated', 'stopped'].includes(this.props.experiment.data.state)) {
      return <div className="page__edit-experiment">
        <Paper style={styling.paper} zDepth={1} rounded={false}>
          <h4>Edit Experiment ({this.props.experiment.data.name})</h4>
          <div className="spacing"></div>
          <p>It is not possible to edit an experiment when in <strong>{this.props.experiment.data.state}</strong> state.</p>
        </Paper>
      </div>;
    }

    return <div className="page__edit-experiment">
      <Paper style={styling.paper} zDepth={1} rounded={false}>
        <h4>Edit Experiment</h4>
        <div className="spacing"></div>
        <AddExperiment
          experiment={this.props.experiment.data}
          setName={this.props.setName}
          setStartDate={this.props.setStartDate}
          setStartTime={this.props.setStartTime}
          setEndDate={this.props.setEndDate}
          setEndTime={this.props.setEndTime}
          setDescription={this.props.setDescription}
          setMaxUsers={this.props.setMaxUsers}
          setSamplingRate={this.props.setSamplingRate}
          validationErrors={this.props.validationErrors}
        />
        <div className="spacing spacing--is-30"></div>
        <Rules
          list={this.props.experiment.data.rules}
          title="Rules"
          delete={this.props.deleteRule}
        />
        <div className="spacing spacing--is-30"></div>
        <Variants
          title="What do you want to show to your users?"
          list={this.props.experiment.data.variants}
          experimentId={this.props.experiment.data.id}
          selectedApplication={this.props.selectedApplication}
          delete={this.props.deleteVariant}
        />
        <div className="spacing spacing--is-30"></div>
        <Exclusions
          title="What experiments do you want to exclude?"
          list={this.props.experiment.data.exclusions}
          indexedExperimentsList={this.props.indexedExperimentsList}
        />
      </Paper>
      <div className="spacing"></div>
      <div className="pull-right">
        <Link to="/experiments"><FlatButton label="cancel" style={styling.button.flat} /></Link>
        <RaisedButton label="save" primary={true} onTouchTap={this.handleClickOnSave} />
      </div>
    </div>;
  }
}
