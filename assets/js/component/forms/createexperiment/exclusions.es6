import React from 'react';

import Helper from 'helper';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';

import AddExclusionForm from 'containers/addexclusionform';

import globalStyling from 'globalstyling';

const styling = {
  ...globalStyling
};

export default class Exclusions extends React.Component {
  static propTypes = {
    title: React.PropTypes.string,
    list: React.PropTypes.array,
    indexedExperimentsList: React.PropTypes.object
  }

  defaultProps = {
    list: []
  }

  state = {
    isAddExclusionVisible: false
  }

  showAddExclusion = () => {
    this.setState({
      isAddExclusionVisible: true
    });
  }

  hideAddExclusion = () => {
    this.setState({
      isAddExclusionVisible: false
    });
  }

  render() {
    let renderedExperiments = [];
    this.props.list.forEach((experimentId) => {
      const experiment = this.props.indexedExperimentsList[experimentId];
      if (experiment) {
        renderedExperiments.push(<TableRow>
          <TableRowColumn>{experiment.name}</TableRowColumn>
          <TableRowColumn>{Helper.formatDateTime(experiment.start_date)}</TableRowColumn>
          <TableRowColumn>{Helper.formatDateTime(experiment.end_date)}</TableRowColumn>
        </TableRow>);
      }
    });

    if (!this.props.list.length) {
      renderedExperiments.push(<TableRow>
        <TableRowColumn colSpan={3} style={styling.emptyTD}>No exclusions</TableRowColumn>
      </TableRow>);
    }

    return <div className="form__experiment-exclusions">
      <div className="row">
        <div className="col-md-6"><h4>{this.props.title}</h4></div>
        <div className="col-md-6">
          <RaisedButton label="select experiments" secondary={true} onTouchTap={this.showAddExclusion} className="pull-right" />
          <AddExclusionForm open={this.state.isAddExclusionVisible} onCancel={this.hideAddExclusion} onAdd={this.hideAddExclusion} />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <Table>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>Name</TableHeaderColumn>
                <TableHeaderColumn>Start Date</TableHeaderColumn>
                <TableHeaderColumn>End Date</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>{renderedExperiments}</TableBody>
          </Table>
        </div>
      </div>
    </div>;
  }
}