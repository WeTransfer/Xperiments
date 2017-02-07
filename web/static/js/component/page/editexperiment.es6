import React from 'react';
import Store from 'store/index.es6';
import Actions from 'action/index.es6';

import Paper from 'material-ui/Paper';
import {Step, Stepper, StepLabel, StepContent} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import CreateExperimentFormStepTwo from 'component/forms/createexperiment/steptwo.es6';
import CreateExperimentFormStepThree from 'component/forms/createexperiment/stepthree.es6';

const styling = {
  paper: {
    padding: 20
  }
};

export default class EditExperimentPage extends React.Component {
  state = {
    finished: false,
    stepIndex: 0,
  }

  componentDidMount() {
    Store.dispatch(Actions.Experiments.get(this.props.params.experimentId));
  }

  handleNext = () => {
    const {stepIndex} = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 1,
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
        return <CreateExperimentFormStepTwo />;
      case 1:
        return <CreateExperimentFormStepThree />;
      default:
        return 'You\'re a long way from home sonny jim!';
    }
  }

  render() {
    const {finished, stepIndex} = this.state;

    return <div className="page__create-experiment">
      <Stepper activeStep={stepIndex}>
        <Step>
          <StepLabel>Segmentation & Variants</StepLabel>
        </Step>
        <Step>
          <StepLabel>Exclude Experiments</StepLabel>
        </Step>
      </Stepper>
      <div>
        <Paper style={styling.paper} zDepth={1} rounded={false}>{this.getStepContent(stepIndex)}</Paper>
        <div className="spacing spacing--is-30"></div>
        <div>
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
