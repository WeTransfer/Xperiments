import React from 'react';

import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';

import AddSegments from './addsegments.es6';
import Variants from './variants.es6';

export default class CreateExperimentFormStepTwo extends React.Component {
  render() {
    return <div className="form__create-experiment form__create-experiment--is-step-two">
      <h5>What users do you want to target?</h5>
      <AddSegments />
      <div className="row">
        <div className="col-md-6">
          <TextField
            defaultValue=""
            floatingLabelText="Maximum Participants (optional)"
          />
        </div>
        <div className="col-md-6">
          <TextField
            defaultValue="100"
            disabled={true}
            floatingLabelText="Sampling Rate (%)"
          />
        </div>
      </div>
      <div className="spacing spacing--is-30"></div>
      <Variants title="What do you want to show to your users?" />
    </div>;
  }
}