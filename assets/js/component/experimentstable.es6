import React from 'react';
import Store from 'store';

import {Link} from 'react-router';

import CloneExperimentContainer from 'containers/cloneexperiment';
import Helper from 'helper';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Chip from 'material-ui/Chip';

import globalStyling from 'globalstyling';
import * as CONSTANTS from 'appconstants';
import config from 'config';

import ExperimentDetails from 'component/experimentdetails';

const styling = {
  ...globalStyling
};

const filters = [
  {label: 'All', value: 'all'},
  {label: 'Draft', value: CONSTANTS.EXPERIMENT_STATE_DRAFT},
  {label: 'Running', value: CONSTANTS.EXPERIMENT_STATE_RUNNING},
  {label: 'Stopped', value: CONSTANTS.EXPERIMENT_STATE_STOPPED},
  {label: 'Terminated', value: CONSTANTS.EXPERIMENT_STATE_TERMINATED}
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
    showingExperimentId: null,
    cloningExperimentId: null
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

  hideCloneExperimentForm = () => {
    this.setState({
      cloningExperimentId: null
    });
  }

  showCloneExperimentForm = id => {
    this.setState({
      cloningExperimentId: id
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
    if (experiment.state === CONSTANTS.EXPERIMENT_STATE_DRAFT) {
      actions.push(' | ');
      actions.push(<Link to={`/experiments/${experiment.id}/edit`} disabled={true}>Edit</Link>);
    }

    // Run / Stop
    let ingPostfix = this.props.isUpdatingState === experiment.id ? 'ing' : '';
    let startAction = <a onClick={() => this.startExperiment(experiment.id)}>{`Start${ingPostfix}`}</a>;
    let terminateAction = <a onClick={() => this.terminateExperiment(experiment.id)}>{`Kill${ingPostfix}`}</a>;
    let stopAction = <a onClick={() => this.stopExperiment(experiment.id)}>{`Stop${ingPostfix}`}</a>;
    let reportAction = <a target="_blank" href={config.reports.url}>Report</a>;

    if (user.role === CONSTANTS.USER_ADMIN) {
      if (experiment.state === CONSTANTS.EXPERIMENT_STATE_DRAFT) {
        actions.push(' | ');
        actions.push(startAction);
      } else if (experiment.state === CONSTANTS.EXPERIMENT_STATE_STOPPED) {
        actions.push(' | ');
        actions.push(startAction);
        actions.push(' | ');
        actions.push(terminateAction);
        actions.push(' | ');
        actions.push(reportAction);
      } else if (experiment.state === CONSTANTS.EXPERIMENT_STATE_RUNNING) {
        actions.push(' | ');
        actions.push(stopAction);
      }
    }


    if (experiment.state === CONSTANTS.EXPERIMENT_STATE_RUNNING) {
      actions.push(' | ');
      actions.push(reportAction);
    }

    // Clone
    actions.push(' | ');
    actions.push(<a onClick={() => this.showCloneExperimentForm(experiment.id)}>Clone</a>);

    // Delete
    // actions.push(" | ");
    // actions.push(<a onClick={() => this.deleteExperiment(experiment.id)}>{`Delete`}</a>);

    return actions;
  }

  getShownExperiment() {
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
        return <Dialog
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
    return null;
  }

  getCloneExperimentForm() {
    if (this.state.cloningExperimentId !== null) {
      let clonableExperiment = this.props.list.filter((experiment) => {
        return experiment.id === this.state.cloningExperimentId;
      });

      if (clonableExperiment) {
        return <CloneExperimentContainer
          isVisible={true}
          experiment={clonableExperiment[0]}
          onClose={this.hideCloneExperimentForm}
          onSave={this.hideCloneExperimentForm}
        />;
      }
    }
    return null;
  }

  renderList() {
    let renderedExperiments = [];

    if (!this.props.isFetching) {
      this.props.list.forEach(experiment => renderedExperiments.push(this.makeRow(experiment)));
    }

    // Empty
    if (!renderedExperiments.length) {
      renderedExperiments.push(<TableRow>
        <TableRowColumn style={styling.emptyTD} colSpan={5}>{this.props.isFetching ? 'Getting your data, hang on...' : 'No experiments'}</TableRowColumn>
      </TableRow>);
    }

    return renderedExperiments;
  }

  makeRow(experiment) {
    let impressions = '-';
    if (experiment.statistics && experiment.statistics.common_impression) {
      impressions = experiment.statistics.common_impression;
    }

    const nameColumnStyling = {
      whiteSpace: 'initial'
    };

    return <TableRow key={`experiment__table-row-${experiment.id}`}>
      <TableRowColumn key={`experiment__table-row-column-name-${experiment.id}`} style={nameColumnStyling}>{experiment.name}</TableRowColumn>
      <TableRowColumn key={`experiment__table-row-column-state-${experiment.id}`}><Chip labelStyle={globalStyling.chipLabel} backgroundColor={globalStyling.stateColors[experiment.state]}>{experiment.state}</Chip></TableRowColumn>
      <TableRowColumn key={`experiment__table-row-column-impressions-${experiment.id}`}>{impressions}</TableRowColumn>
      <TableRowColumn key={`experiment__table-row-column-start-date-${experiment.id}`}>{Helper.formatDateTime(experiment.start_date)}</TableRowColumn>
      <TableRowColumn key={`experiment__table-row-column-end-date-${experiment.id}`}>{Helper.formatDateTime(experiment.end_date)}</TableRowColumn>
      <TableRowColumn key={`experiment__table-row-column-created-by-${experiment.id}`}>{experiment.user.name}</TableRowColumn>
      <TableRowColumn key={`experiment__table-row-column-actions-${experiment.id}`}>{this.getActions(experiment)}</TableRowColumn>
    </TableRow>;
  }

  renderFilter() {
    let filterItems = [];
    filters.forEach(filter => {
      filterItems.push(<MenuItem value={filter.value} primaryText={filter.label} />);
    });

    return <SelectField
      floatingLabelText="Filter by"
      value={this.props.currentFilter}
      onChange={(e, index, value) => this.props.filter(value)}
    >
      {filterItems}
    </SelectField>;
  }

  render() {
    return <div className="experiments__table">
      <div className="row">
        <div className="col-xs-6"><h4>{this.props.title}</h4></div>
        <div className="col-xs-6">
          <div className="pull-right">{this.renderFilter()}</div>
        </div>
      </div>
      <Table>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Status</TableHeaderColumn>
            <TableHeaderColumn>Impressions</TableHeaderColumn>
            <TableHeaderColumn>Start Date (UTC)</TableHeaderColumn>
            <TableHeaderColumn>End Date (UTC)</TableHeaderColumn>
            <TableHeaderColumn>Created By</TableHeaderColumn>
            <TableHeaderColumn></TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>{this.renderList()}</TableBody>
      </Table>
      {this.getShownExperiment()}
      {this.getCloneExperimentForm()}
    </div>;
  }
}