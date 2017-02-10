import React from 'react';

import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

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
      <div className="form__create-experiment form__create-experiment--is-step-one">
        <div className="row">
          <div className="col-md-3">
            <TextField
              defaultValue={this.props.experiment.name || ""}
              floatingLabelText="Name"
              onChange={(e, value) => {this.props.setName(value);}}
              errorText={this.props.validationErrors.name || null}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-5">
            <DatePicker
              value={this.props.experiment.start_date}
              floatingLabelText="Start Date"
              mode="landscape"
              onChange={(e, value) => {this.props.setStartDate(value);}}
            />
          </div>
          <div className="col-md-7">
            <TimePicker
              value={this.props.experiment.start_date}
              floatingLabelText="Start Time"
              onChange={(e, value) => {this.props.setStartTime(value);}}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-5">
            <DatePicker
              value={this.props.experiment.end_date}
              floatingLabelText="End Date"
              mode="landscape"
              onChange={(e, value) => {this.props.setEndDate(value);}}
            />
          </div>
          <div className="col-md-7">
            <TimePicker
              value={this.props.experiment.end_date}
              floatingLabelText="End Time"
              onChange={(e, value) => {this.props.setEndTime(value);}}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-5">
            <TextField
              defaultValue={this.props.experiment.max_users !== null ? this.props.experiment.max_users : ''}
              floatingLabelText="Maximum Participants (optional)"
              onChange={(e, value) => {this.props.setMaxUsers(value);}}
              errorText={this.props.validationErrors.max_users || null}
            />
          </div>
          <div className="col-md-5">
            <TextField
              defaultValue={this.props.experiment.sampling_rate}
              disabled={true}
              floatingLabelText="Sampling Rate (%)"
              onChange={(e, value) => {this.props.setSamplingRate(value);}}
              errorText={this.props.validationErrors.sampling_rate || null}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <TextField
              value={this.props.experiment.description || ""}
              floatingLabelText="Hypothesis/Description"
              multiLine={true}
              rows={2}
              onChange={(e, value) => {this.props.setDescription(value);}}
              fullWidth={true}
              errorText={this.props.validationErrors.description || null}
            />
          </div>
        </div>
      </div>
    </Dialog>;
  }
}