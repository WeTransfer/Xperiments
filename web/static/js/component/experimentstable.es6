import React from 'react';
import Store from 'store/index.es6';

import {Link} from 'react-router';

import CloneExperimentContainer from 'containers/cloneexperiment.es6';

import Helper from 'helper.es6';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Chip from 'material-ui/Chip';

import globalStyling from 'globalstyling.es6';
import config from 'config.es6';

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

    // Clone
    actions.push(' | ');
    actions.push(<a onClick={() => this.showCloneExperimentForm(experiment.id)}>Clone</a>);

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
            onTouchTap={::this.hideCloneExperimentForm}
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
    return <TableRow key={`experiment__table-row-${experiment.id}`}>
      <TableRowColumn key={`experiment__table-row-column-name-${experiment.id}`}>{experiment.name}</TableRowColumn>
      <TableRowColumn key={`experiment__table-row-column-vre-${experiment.id}`}>{`${experiment.rules.length} - ${experiment.variants.length} - ${experiment.exclusions.length}`}</TableRowColumn>
      <TableRowColumn key={`experiment__table-row-column-state-${experiment.id}`}><Chip labelStyle={globalStyling.chipLabel} backgroundColor={globalStyling.stateColors[experiment.state]}>{experiment.state}</Chip></TableRowColumn>
      <TableRowColumn key={`experiment__table-row-column-start-date-${experiment.id}`}>{Helper.formatDateTime(experiment.start_date)}</TableRowColumn>
      <TableRowColumn key={`experiment__table-row-column-end-date-${experiment.id}`}>{Helper.formatDateTime(experiment.end_date)}</TableRowColumn>
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
            <TableHeaderColumn>Start Date</TableHeaderColumn>
            <TableHeaderColumn>End Date</TableHeaderColumn>
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
