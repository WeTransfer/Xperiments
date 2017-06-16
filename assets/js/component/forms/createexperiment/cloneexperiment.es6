import React from 'react';

import Form from 'component/form';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';

import globalStyling from 'globalstyling';
import Helper from 'helper';

const styling = {
  ...globalStyling
};

export default class CloneExperiment extends Form {
  static propTypes = {
    experiment: React.PropTypes.object,
    setName: React.PropTypes.func,
    setStartDate: React.PropTypes.func,
    setStartTime: React.PropTypes.func,
    setEndDate: React.PropTypes.func,
    setEndTime: React.PropTypes.func,
    save: React.PropTypes.func,
    cancel: React.PropTypes.func,
    isVisible: React.PropTypes.bool,
    validationErrors: React.PropTypes.object,
    unsetValidationError: React.PropTypes.func
  };

  save = () => {
    this.props.save(this.props.experiment, 'cloneExperimentForm');
  }

  render() {
    let currentTimezoneText = null;
    if (this.props.experiment.start_date && this.props.experiment.end_date) {
      currentTimezoneText = <div className="row">
        <div className="col-md-12">
          <h5>Note: This experiment will run from {Helper.formatDateTime(this.props.experiment.start_date, true)} to {Helper.formatDateTime(this.props.experiment.end_date, true)} (UTC)</h5>
        </div>
      </div>;
    }

    const actions = [
      <FlatButton
        label="Cancel"
        primary={false}
        disabled={this.props.experiment.isSaving}
        onTouchTap={this.props.cancel}
        style={styling.flatButton}
      />,
      <RaisedButton
        label="Clone"
        primary={true}
        disabled={this.props.experiment.isSaving}
        onTouchTap={this.save}
      />
    ];

    return <Dialog modal={true} actions={actions} open={this.props.isVisible} title="Clone Experiment">
      <div className="form__clone-experiment">
        <div className="row">
          <div className="col-md-12">
            <TextField
              fullWidth={true}
              defaultValue={this.props.experiment.name || ''}
              floatingLabelText="Name"
              onChange={(e, value) => {
                this.props.setName(value);
                this.unsetError('name');
              }}
              errorText={this.getError('name')}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-5">
            <DatePicker
              value={this.props.experiment.start_date ? new Date(this.props.experiment.start_date) : null}
              floatingLabelText="Start Date"
              mode="portrait"
              onChange={(e, value) => {
                this.props.setStartDate(value);
                this.unsetError('start_date');
              }}
              errorText={this.getError('start_date')}
            />
          </div>
          <div className="col-md-7">
            <TimePicker
              value={this.props.experiment.start_date ? new Date(this.props.experiment.start_date) : null}
              floatingLabelText="Start Time"
              onChange={(e, value) => {
                this.props.setStartTime(value);
                this.unsetError('start_date');
              }}
              errorText={this.getError('start_date')}
              format="24hr"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-5">
            <DatePicker
              value={this.props.experiment.end_date ? new Date(this.props.experiment.end_date) : null}
              floatingLabelText="End Date"
              mode="portrait"
              onChange={(e, value) => {
                this.props.setEndDate(value);
                this.unsetError('end_date');
              }}
              errorText={this.getError('end_date')}
            />
          </div>
          <div className="col-md-7">
            <TimePicker
              value={this.props.experiment.end_date ? new Date(this.props.experiment.end_date) : null}
              floatingLabelText="End Time"
              onChange={(e, value) => {
                this.props.setEndTime(value);
                this.unsetError('end_date');
              }}
              errorText={this.getError('end_date')}
              format="24hr"
            />
          </div>
        </div>
        {currentTimezoneText}
      </div>
    </Dialog>;
  }
}