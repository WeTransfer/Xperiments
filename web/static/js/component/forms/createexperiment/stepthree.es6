import React from 'react';

import ExcludeExperiments from './excludeexperiments.es6';

export default class CreateExperimentFormStepThree extends React.Component {
  render() {
    return <div className="form__create-experiment form__create-experiment--is-step-three">
      <ExcludeExperiments />
    </div>;
  }
}