import React from 'react';

import {Link} from 'react-router';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const styling = {
  emptyTD: {
    textAlign: 'center'
  }
};

const filters = [
  {label: 'All', value: 'all'},
  {label: 'Draft', value: 'draft'},
  {label: 'Running', value: 'running'},
  {label: 'Stopped', value: 'stopped'},
  {label: 'Terminated', value: 'terminated'}
];

export default class ExperimentsTable extends React.Component {
  static propTypes = {
    list: React.PropTypes.object.isRequired,
    isUpdatingState: React.PropTypes.bool.isRequired,
    isFetching: React.PropTypes.bool.isRequired,
    currentFilter: React.PropTypes.string.isRequired,
    start: React.PropTypes.func.isRequired,
    stop: React.PropTypes.func.isRequired,
    terminate: React.PropTypes.func.isRequired,
    title: React.PropTypes.string
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

  startExperiment(experimentId) {
    if (this.props.isUpdatingState !== false) return;
    this.props.start(experimentId);
  }

  stopExperiment(experimentId) {
    if (this.props.isUpdatingState !== false) return;
    this.props.stop(experimentId);
  }

  terminateExperiment(experimentId) {
    if (this.props.isUpdatingState !== false) return;
    this.props.terminate(experimentId);
  }

  getActions (experiment) {
    let actions = [];
    // Edit
    if (experiment.state === 'draft') {
      actions.push(<Link to={`/experiments/${experiment.id}/edit`} disabled={true}>Edit</Link>);
      actions.push(" | ");
    }
    
    // View
    actions.push(<a href="#" onClick={() => this.showExperiment(experiment.id)}>View</a>);

    // Run / Stop
    let ingPostfix = this.props.isUpdatingState === experiment.id ? 'ing' : '';
    let startAction = <a onClick={() => this.startExperiment(experiment.id)}>{`Start${ingPostfix}`}</a>;
    let terminateAction = <a onClick={() => this.terminateExperiment(experiment.id)}>{`Kill${ingPostfix}`}</a>;
    let stopAction = <a onClick={() => this.stopExperiment(experiment.id)}>{`Stop${ingPostfix}`}</a>;
    
    if (experiment.state === 'draft') {
      actions.push(" | ");
      actions.push(startAction);
    } else if (experiment.state === 'stopped') {
      actions.push(" | ");
      actions.push(startAction);
      actions.push(" | ");
      actions.push(terminateAction);
    } else if (experiment.state === 'running') {
      actions.push(" | ");
      actions.push(stopAction);
    }

    return actions;
  }

  render() {
    let renderedExperiments = [];
    if (!this.props.isFetching) {
      this.props.list.forEach((experiment) => {
        renderedExperiments.push(React.createElement(TableRow, {key: `experiment__table-row-${experiment.id}`}, [
          React.createElement(TableRowColumn, {key: `experiment__table-row-column-name-${experiment.id}`}, experiment.name),
          React.createElement(TableRowColumn, {key: `experiment__table-row-column-vre-${experiment.id}`}, `${experiment.rules.length} - ${experiment.variants.length} - ${experiment.exclusions.length}`),
          React.createElement(TableRowColumn, {key: `experiment__table-row-column-state-${experiment.id}`}, experiment.state),
          React.createElement(TableRowColumn, {key: `experiment__table-row-column-actions-${experiment.id}`}, this.getActions(experiment))
        ]));
      });
    }

    if (!renderedExperiments.length) {
      renderedExperiments.push(<TableRow>
        <TableRowColumn style={styling.emptyTD} colSpan={5}>{this.props.isFetching ? 'Getting your data, hang on...' : 'No data'}</TableRowColumn>
      </TableRow>);
    }

    let dialog = null;
    if (this.state.showingExperimentId !== null) {
      let visibleExperiment = this.props.list.filter((experiment) => {
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

    let filterItems = [];
    filters.forEach(filter => {
      filterItems.push(<MenuItem value={filter.value} primaryText={filter.label} />);
    });

    return <div className="experiments__table">
      <div className="row">
        <div className="col-xs-6"><h4>{this.props.title}</h4></div>
        <div className="col-xs-6">
          <div className="pull-right">
            <SelectField
              floatingLabelText="Filter by"
              value={this.props.currentFilter}
              onChange={(e, index, value) => this.props.filter(value)}
            >
              {filterItems}
            </SelectField>
          </div>
        </div>
      </div>
      <Table>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Rules - Variants - Exclusions</TableHeaderColumn>
            <TableHeaderColumn>Status</TableHeaderColumn>
            <TableHeaderColumn></TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>{renderedExperiments}</TableBody>
      </Table>
      {dialog}
    </div>;
  }
}
