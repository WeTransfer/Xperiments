import React from 'react';
import Store from 'store/index.es6';
import Actions from 'action/index.es6';
import {Link} from 'react-router';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import Rules from 'component/forms/createexperiment/rules.es6';
import Variants from 'component/forms/createexperiment/variants.es6';
import Exclusions from 'component/forms/createexperiment/exclusions.es6';

const styling = {
  paper: {
    padding: 20,
    marginTop: 30
  },
  button: {
    flat: {
      marginRight: 10
    }
  }
};

export default class EditExperimentPage extends React.Component {
  static propTypes = {
    experiment: React.PropTypes.object,
    save: React.PropTypes.func
  };

  componentWillMount() {
    Store.dispatch(Actions.Experiment.get(this.props.params.experimentId));
  }

  handleClickOnSave = () => {
    this.props.save(this.props.experiment.data);
  }

  render() {
    if (this.props.experiment.isFetching === undefined || this.props.experiment.isFetching === true)
      return null;

    return <div className="page__edit-experiment">
      <Paper style={styling.paper} zDepth={1} rounded={false}>
        <Rules title="What users do you want to target?" list={this.props.experiment.data.rules} />
        <div className="spacing spacing--is-30"></div>
        <Variants title="What do you want to show to your users?" list={this.props.experiment.data.variants} />
        <div className="spacing spacing--is-30"></div>
        <Exclusions title="What experiments do you want to exclude?" list={this.props.experiment.data.exclusions} />
      </Paper>
      <div className="spacing"></div>
      <div className="pull-right">
        <Link to="/experiments"><FlatButton label="cancel" style={styling.button.flat} /></Link>
        <RaisedButton label="save" primary={true} onTouchTap={this.handleClickOnSave} />
      </div>
    </div>;
  }
}
