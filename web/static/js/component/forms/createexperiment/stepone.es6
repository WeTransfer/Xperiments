import React from 'react';

import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';

export default class CreateExperimentFormStepOne extends React.Component {
  static propTypes = {
    experiment: React.PropTypes.object,
    setName: React.PropTypes.func,
    setStartDate: React.PropTypes.func,
    setStartTime: React.PropTypes.func,
    setEndDate: React.PropTypes.func,
    setEndTime: React.PropTypes.func,
    setDescription: React.PropTypes.func,
    validate: React.PropTypes.func,
    save: React.PropTypes.func
  };

  render() {
    console.log(this.props.experiment)
    return <div className="form__create-experiment form__create-experiment--is-step-one">
      <div className="row">
        <div className="col-md-3">
          <TextField
            defaultValue=""
            floatingLabelText="Name"
            onChange={(e, value) => {this.props.setName(value);}}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <DatePicker
            floatingLabelText="Start Date"
            mode="landscape"
            onChange={(e, value) => {this.props.setStartDate(value);}}
          />
        </div>
        <div className="col-md-8">
          <TimePicker
            floatingLabelText="Start Time"
            onChange={(e, value) => {this.props.setStartTime(value);}}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <DatePicker
            floatingLabelText="End Date"
            mode="landscape"
            onChange={(e, value) => {this.props.setEndDate(value);}}
          />
        </div>
        <div className="col-md-8">
          <TimePicker
            floatingLabelText="End Time"
            onChange={(e, value) => {this.props.setEndTime(value);}}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <TextField
            floatingLabelText="Hypothesis/Description"
            multiLine={true}
            rows={2}
            onChange={(e, value) => {this.props.setDescription(value);}}
            fullWidth={true}
          />
        </div>
      </div>
    </div>;
  }
}