import React from 'react';

import {Step, Stepper, StepLabel, StepContent} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import CreateExperimentFormStepOne from 'component/forms/createexperiment/stepone.es6';
import CreateExperimentFormStepTwo from 'component/forms/createexperiment/steptwo.es6';
import CreateExperimentFormStepThree from 'component/forms/createexperiment/stepthree.es6';

export default class CreateExperimentPage extends React.Component {
  state = {
    finished: false,
    stepIndex: 0,
  }

  handleNext = () => {
    const {stepIndex} = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2,
    });
  };

  handlePrev = () => {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return <CreateExperimentFormStepOne />;
      case 1:
        return <CreateExperimentFormStepTwo />;
      case 2:
        return <CreateExperimentFormStepThree />;
      default:
        return 'You\'re a long way from home sonny jim!';
    }
  }

  render() {
    const {finished, stepIndex} = this.state;
    const contentStyle = {margin: '0 16px'};

    return <div className="page__create-experiment">
      <Stepper activeStep={stepIndex}>
        <Step>
          <StepLabel>Create Experiment</StepLabel>
        </Step>
        <Step>
          <StepLabel>Add variants</StepLabel>
        </Step>
        <Step>
          <StepLabel>Ready</StepLabel>
        </Step>
      </Stepper>
      <div style={contentStyle}>
        {this.getStepContent(stepIndex)}
        <div style={{marginTop: 12}}>
          <FlatButton
            label="Back"
            disabled={stepIndex === 0}
            onTouchTap={this.handlePrev}
            style={{marginRight: 12}}
          />
          <RaisedButton
            label={stepIndex === 2 ? 'Finish' : 'Next'}
            primary={true}
            onTouchTap={this.handleNext}
          />
        </div>
      </div>
    </div>;
  }
}
