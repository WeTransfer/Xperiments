import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import AddExperiment from './addexperiment.es6';

const styling = {
  flatButton: {
    marginRight: 10
  }
};

export default class CreateExperimentFormStepOne extends React.Component {
  static propTypes = {
    experiment: React.PropTypes.object,
    setName: React.PropTypes.func,
    setStartDate: React.PropTypes.func,
    setStartTime: React.PropTypes.func,
    setEndDate: React.PropTypes.func,
    setEndTime: React.PropTypes.func,
    setDescription: React.PropTypes.func,
    setMaxUsers: React.PropTypes.func,
    setSamplingRate: React.PropTypes.func,
    save: React.PropTypes.func,
    cancel: React.PropTypes.func,
    isVisible: React.PropTypes.bool,
    validationErrors: React.PropTypes.object
  };

  save = () => {
    this.props.save(this.props.experiment, 'createExperimentForm');
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={false}
        disabled={this.props.experiment.isSaving}
        onTouchTap={this.props.cancel}
        style={styling.flatButton}
      />,
      <RaisedButton
        label="Submit"
        primary={true}
        disabled={this.props.experiment.isSaving}
        onTouchTap={this.save}
      />
    ];

    return <Dialog modal={true} actions={actions} open={this.props.isVisible} title="Create Experiment">
      <AddExperiment
        experiment={this.props.experiment}
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
    </Dialog>;
  }
}