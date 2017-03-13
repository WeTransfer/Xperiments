import React from 'react';

import Form from 'component/form';

import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';

import Helper from 'helper';

export default class AddExperiment extends Form {
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
    validationErrors: React.PropTypes.object,
    unsetValidationError: React.PropTypes.func
  };

  render() {
    let datePickerOptions = {
      minDate: new Date(),
      okLabel: 'Select',
      mode: 'portrait'
    };

    let currentTimezoneText = null;
    if (this.props.experiment.start_date && this.props.experiment.end_date) {
      currentTimezoneText = <div className="row">
        <div className="col-md-12">
          <h5>Note: This experiment will run from {Helper.formatDateTime(this.props.experiment.start_date, true)} to {Helper.formatDateTime(this.props.experiment.end_date, true)} (UTC).</h5>
        </div>
      </div>;
    }

    return <div className="form__create-experiment form__create-experiment--is-step-one">
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
        <div className="col-md-12">
          <TextField
            value={this.props.experiment.description || ''}
            floatingLabelText="Hypothesis/Description"
            multiLine={true}
            rows={2}
            onChange={(e, value) => {
              this.props.setDescription(value);
              this.unsetError('description');
            }}
            fullWidth={true}
            errorText={this.getError('description')}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-5">
          <DatePicker
            value={this.props.experiment.start_date ? new Date(this.props.experiment.start_date) : null}
            floatingLabelText="Start Date"
            onChange={(e, value) => {
              this.props.setStartDate(value);
              this.unsetError('start_date');
            }}
            errorText={this.getError('start_date')}
            {...datePickerOptions}
          />
        </div>
        <div className="col-md-7">
          <TimePicker
            value={this.props.experiment.start_date ? new Date(this.props.experiment.start_date) : null}
            floatingLabelText="Start Time (GMT)"
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
            fullWidth={true}
            value={this.props.experiment.end_date ? new Date(this.props.experiment.end_date) : null}
            floatingLabelText="End Date"
            onChange={(e, value) => {
              console.log(value);
              this.props.setEndDate(value);
              this.unsetError('end_date');
            }}
            errorText={this.getError('end_date')}
            {...datePickerOptions}
          />
        </div>
        <div className="col-md-7">
          <TimePicker
            value={this.props.experiment.end_date ? new Date(this.props.experiment.end_date) : null}
            floatingLabelText="End Time (GMT)"
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
      <div className="row">
        <div className="col-md-12">
          <TextField
            fullWidth={true}
            defaultValue={this.props.experiment.max_users !== null ? this.props.experiment.max_users : ''}
            floatingLabelText="Total Number of Participants (optional)"
            onChange={(e, value) => {
              this.props.setMaxUsers(value);
              this.unsetError('max_users');
            }}
            errorText={this.getError('max_users')}
          />
        </div>
      </div>
    </div>;
  }
}