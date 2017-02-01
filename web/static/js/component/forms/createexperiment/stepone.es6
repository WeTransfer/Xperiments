import React from 'react';

import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';

export default class CreateExperimentFormStepOne extends React.Component {
  render() {
    return <div className="form__create-experiment form__create-experiment--is-step-one">
      <div className="row">
        <div className="col-md-3">
          <TextField
            defaultValue=""
            floatingLabelText="Name"
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <DatePicker floatingLabelText="Start Date" mode="landscape" />
        </div>
        <div className="col-md-8">
          <TimePicker floatingLabelText="Start Time"/>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4">
          <DatePicker floatingLabelText="End Date" mode="landscape" />
        </div>
        <div className="col-md-8">
          <TimePicker floatingLabelText="End Time"/>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <TextField
            floatingLabelText="Hypothesis/Description"
            multiLine={true}
            rows={2}
          />
        </div>
      </div>
    </div>;
  }
}