import React from 'react';
import Store from 'store';

import {Link} from 'react-router';

import Helper from 'helper';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Chip from 'material-ui/Chip';

import globalStyling from 'globalstyling';
import config from 'config';

import ExperimentDetails from 'component/experimentdetails.es6';

const styling = {
  ...globalStyling
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
    isDeleting: React.PropTypes.bool.isRequired,
    currentFilter: React.PropTypes.string.isRequired,
    start: React.PropTypes.func.isRequired,
    stop: React.PropTypes.func.isRequired,
    terminate: React.PropTypes.func.isRequired,
    delete: React.PropTypes.func.isRequired,
    title: React.PropTypes.string,
    filter: React.PropTypes.func
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

  deleteExperiment(experimentId) {
    if (this.props.isDeleting !== false) return;
    this.props.delete(experimentId);
  }

  getActions(experiment) {
    const {user} = Store.getState();

    let actions = [];

    // View
    actions.push(<a href="#" onClick={() => this.showExperiment(experiment.id)}>View</a>);

    // Edit
    if (experiment.state === 'draft') {
      actions.push(' | ');
      actions.push(<Link to={`/experiments/${experiment.id}/edit`} disabled={true}>Edit</Link>);
    }

    // Run / Stop
    let ingPostfix = this.props.isUpdatingState === experiment.id ? 'ing' : '';
    let startAction = <a onClick={() => this.startExperiment(experiment.id)}>{`Start${ingPostfix}`}</a>;
    let terminateAction = <a onClick={() => this.terminateExperiment(experiment.id)}>{`Kill${ingPostfix}`}</a>;
    let stopAction = <a onClick={() => this.stopExperiment(experiment.id)}>{`Stop${ingPostfix}`}</a>;
    let reportAction = <a target="_blank" href="https://analytics.google.com/analytics/web/?authuser=1#my-reports/5IyMQAn0Tcqdu2Va8V9BIg/a69714416w130256140p134086343/%3F_u.date00%3D20170227%26_u.date01%3D20170227%26_u.sampleOption%3Dmoreprecision%26_u.sampleSize%3D500000/">Report</a>;
    
    if (config.users[user.email] && config.users[user.email].rights && config.users[user.email].rights.indexOf('CHANGE_STATE') > -1) {
      if (experiment.state === 'draft') {
        actions.push(' | ');
        actions.push(startAction);
      } else if (experiment.state === 'stopped') {
        actions.push(' | ');
        actions.push(startAction);
        actions.push(' | ');
        actions.push(terminateAction);
        actions.push(' | ');
        actions.push(reportAction);
      } else if (experiment.state === 'running') {
        actions.push(' | ');
        actions.push(stopAction);
        actions.push(' | ');
        actions.push(reportAction);
      }
    }

    // Delete
    // actions.push(" | ");
    // actions.push(<a onClick={() => this.deleteExperiment(experiment.id)}>{`Delete`}</a>);

    return actions;
  }

  render() {
    let renderedExperiments = [];
    if (!this.props.isFetching) {
      this.props.list.forEach((experiment) => {
        renderedExperiments.push(React.createElement(TableRow, {key: `experiment__table-row-${experiment.id}`}, [
          React.createElement(TableRowColumn, {key: `experiment__table-row-column-name-${experiment.id}`}, experiment.name),
          React.createElement(TableRowColumn, {key: `experiment__table-row-column-state-${experiment.id}`}, <Chip labelStyle={globalStyling.chipLabel} backgroundColor={globalStyling.stateColors[experiment.state]}>{experiment.state}</Chip>),
          React.createElement(TableRowColumn, {key: `experiment__table-row-column-start-date-${experiment.id}`}, Helper.formatDateTime(experiment.start_date)),
          React.createElement(TableRowColumn, {key: `experiment__table-row-column-end-date-${experiment.id}`}, Helper.formatDateTime(experiment.end_date)),
          React.createElement(TableRowColumn, {key: `experiment__table-row-column-actions-${experiment.id}`}, this.getActions(experiment))
        ]));
      });
    }

    if (!renderedExperiments.length) {
      renderedExperiments.push(<TableRow>
        <TableRowColumn style={styling.emptyTD} colSpan={5}>{this.props.isFetching ? 'Getting your data, hang on...' : 'No experiments'}</TableRowColumn>
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
          />
        ];
        dialog = <Dialog
          modal={true}
          open={true}
          title={visibleExperiment[0].name}
          actions={actions}
          repositionOnUpdate={true}
          autoScrollBodyContent={true}
        >
          <ExperimentDetails
            experiment={visibleExperiment[0]}
          />
        </Dialog>;
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
            <TableHeaderColumn>Status</TableHeaderColumn>
            <TableHeaderColumn>Start Date</TableHeaderColumn>
            <TableHeaderColumn>End Date</TableHeaderColumn>
            <TableHeaderColumn></TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>{renderedExperiments}</TableBody>
      </Table>
      {dialog}
    </div>;
  }
}
