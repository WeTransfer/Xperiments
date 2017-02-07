import React from 'react';

import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';

import AddSegments from './addsegments.es6';
import Variants from './variants.es6';

export default class CreateExperimentFormStepTwo extends React.Component {
  static propTypes = {
    samplingRate: React.PropTypes.number,
    maxUsers: React.PropTypes.number,
    rules: React.PropTypes.array,
    variants: React.PropTypes.array,
    onRuleAdd: React.PropTypes.func,
    onVariantAdd: React.PropTypes.func
  };

  render() {
    return <div className="form__create-experiment form__create-experiment--is-step-two">
      <h5>What users do you want to target?</h5>
      <AddSegments list={this.props.rules} />
      <div className="row">
        <div className="col-md-3">
          <TextField
            defaultValue={this.props.maxUsers !== null ? this.props.maxUsers : ''}
            floatingLabelText="Maximum Participants (optional)"
          />
        </div>
        <div className="col-md-9">
          <TextField
            defaultValue={this.props.samplingRate}
            disabled={true}
            floatingLabelText="Sampling Rate (%)"
          />
        </div>
      </div>
      <div className="spacing spacing--is-30"></div>
      <Variants title="What do you want to show to your users?" list={this.props.variants} />
    </div>;
  }
}