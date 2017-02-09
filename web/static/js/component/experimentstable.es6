import React from 'react';

import {Link} from 'react-router';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

const styling = {
  emptyTD: {
    textAlign: 'center'
  }
};

export default class ExperimentsTable extends React.Component {
  static propTypes = {
    experiments: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: PropTypes.number.isRequired,
      state: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      variants: PropTypes.array.isRequired,
      isActive: PropTypes.bool.isRequired
    }).isRequired).isRequired
  };

  state = {
    showingExperimentId: null 
  }
  
  showExperiment(id) {
    this.setState({
      showingExperimentId: id
    });
  }

  hideExperiment() {
    this.setState({
      showingExperimentId: null
    });
  }

  render() {
    let renderedExperiments = [];
    if (!this.props.experiments.isFetching) {
      this.props.experiments.list.forEach((experiment) => {
        let actions = [];
        if (!experiment.isActive)
          actions.push(<Link to={`/experiments/${experiment.id}/edit`}>Edit</Link>);
        actions.push(" | ");
        actions.push(<a href="#" onClick={() => this.showExperiment(experiment.id)}>View</a>);

        renderedExperiments.push(React.createElement(TableRow, {key: `experiment__table-row-${experiment.id}`}, [
          React.createElement(TableRowColumn, {key: `experiment__table-row-column-name-${experiment.id}`}, experiment.name),
          React.createElement(TableRowColumn, {key: `experiment__table-row-column-id-${experiment.id}`}, experiment.id),
          React.createElement(TableRowColumn, {key: `experiment__table-row-column-variants-${experiment.id}`}, experiment.variants.length),
          React.createElement(TableRowColumn, {key: `experiment__table-row-column-state-${experiment.id}`}, experiment.state),
          React.createElement(TableRowColumn, {key: `experiment__table-row-column-actions-${experiment.id}`}, actions)
        ]));
      });
    }

    if (!renderedExperiments.length) {
      renderedExperiments.push(<TableRow>
        <TableRowColumn style={styling.emptyTD} colSpan={5}>{this.props.experiments.isFetching ? 'Getting your data, hang on...' : 'No data'}</TableRowColumn>
      </TableRow>);
    }

    let dialog = null;
    if (this.state.showingExperimentId !== null) {
      let visibleExperiment = this.props.experiments.list.filter((experiment) => {
        return experiment.id === this.state.showingExperimentId;
      });
      
      if (visibleExperiment) {
        const actions = [
          <FlatButton
            label="close"
            primary={true}
            onTouchTap={::this.hideExperiment}
          />,
        ];
        dialog = <Dialog modal={true} open={true} title={visibleExperiment.name} actions={actions}>
          <TextField disabled={true} rows={10} multiLine={true} defaultValue={JSON.stringify(visibleExperiment)} fullWidth={true} floatingLabelText="Data" />
        </Dialog>
      }
    }

    return <div className="experiments__table">
      {dialog}
      <Table>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>ID</TableHeaderColumn>
            <TableHeaderColumn>Variants</TableHeaderColumn>
            <TableHeaderColumn>Status</TableHeaderColumn>
            <TableHeaderColumn></TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>{renderedExperiments}</TableBody>
      </Table>
    </div>;
  }
}
