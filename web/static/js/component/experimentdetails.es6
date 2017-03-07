import React from 'react';

import Variants from 'component/forms/createexperiment/variants.es6';
import Rules from 'component/forms/createexperiment/rules.es6';

export default class ExperimentDetails extends React.Component {
  static propTypes = {
    experiment: React.PropTypes.object
  };

  render() {
    return <div className="experiment__details">
      <Rules
        list={this.props.experiment.rules}
        title="Targeting"
        readOnly={true}
      />
      <Variants
        list={this.props.experiment.variants}
        title="Variants"
        readOnly={true}
      />
    </div>;
  }
}