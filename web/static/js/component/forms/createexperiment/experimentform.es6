import React from 'React';

import Form from 'component/form.es6';

import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

const styling = {
  flatButton: {
    marginRight: 10
  }
};

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

  constructor(props) {
    super(props);
  }

  render() {
    return <div className="form__create-experiment form__create-experiment--is-step-one">
      <div className="row">
        <div className="col-md-12">
          <TextField
            fullWidth={true}
            defaultValue={this.props.experiment.name || ""}
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
            value={this.props.experiment.description || ""}
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
            mode="landscape"
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
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-5">
          <DatePicker
            value={this.props.experiment.end_date ? new Date(this.props.experiment.end_date) : null}
            floatingLabelText="End Date"
            mode="landscape"
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
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-5">
          <TextField
            defaultValue={this.props.experiment.max_users !== null ? this.props.experiment.max_users : ''}
            floatingLabelText="Maximum Participants (optional)"
            onChange={(e, value) => {
              this.props.setMaxUsers(value);
              this.unsetError('max_users');
            }}
            errorText={this.getError('max_users')}
          />
        </div>
        <div className="col-md-5">
          <TextField
            defaultValue={this.props.experiment.sampling_rate}
            disabled={true}
            floatingLabelText="Sampling Rate (%)"
            onChange={(e, value) => {
              this.props.setSamplingRate(value);
              this.unsetError('sampling_rate');
            }}
            errorText={this.getError('sampling_rate')}
          />
        </div>
      </div>
    </div>;
  }
}