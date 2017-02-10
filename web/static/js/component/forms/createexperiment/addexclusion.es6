import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

const styling = {
  checkbox: {
    marginTop: 30
  },
  flatButton: {
    marginRight: 10
  }
};

export default class AddExclusion extends React.Component {
  static propTypes = {
    set: React.PropTypes.func,
    onCancel: React.PropTypes.func,
    onAdd: React.PropTypes.func,
    list: React.PropTypes.array,
    currentlyExcluded: React.PropTypes.array
  }

  handleAdd = () => {
    let exclusions = [];
    this.refs.tableBody.state.selectedRows.forEach(rowNumber => {
      exclusions.push(this.props.list[rowNumber].id);
    })
    this.props.set(exclusions);
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.props.onCancel}
        style={styling.flatButton}
      />,
      <RaisedButton
        label="Done"
        primary={true}
        disabled={false}
        onTouchTap={this.handleAdd}
      />,
    ];

    let renderedExcludedExperiments = [];
    this.props.list.forEach((experiment) => {
      let selected = this.props.currentlyExcluded.indexOf(experiment.id) !== -1 ? true : false;
      renderedExcludedExperiments.push(<TableRow selected={selected}>
        <TableRowColumn>{experiment.name}</TableRowColumn>
        <TableRowColumn>{experiment.start_date}</TableRowColumn>
        <TableRowColumn>{experiment.end_date}</TableRowColumn>
      </TableRow>);
    });

    if (!this.props.list.length) {
      renderedExcludedExperiments.push(<TableRow>
        <TableRowColumn colSpan={3} style={styling.emptyTD}>No data</TableRowColumn>
      </TableRow>);
    }

    return <div className="form__add-exclusion">
      <Dialog title="Select Experiments" actions={actions} modal={true} open={this.props.open}>
        <div className="row">
          <div className="col-md-12">
            <Table
              height={300}
              fixedHeader={true}
              multiSelectable={true}
              selectable={true}
            >
              <TableHeader
                displaySelectAll={true}
                adjustForCheckbox={true}
                enableSelectAll={true}
              >
                <TableRow>
                  <TableHeaderColumn>Name</TableHeaderColumn>
                  <TableHeaderColumn>Start Date</TableHeaderColumn>
                  <TableHeaderColumn>End Date</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody ref="tableBody" deselectOnClickaway={false}>{renderedExcludedExperiments}</TableBody>
            </Table>
          </div>
        </div>
      </Dialog>
    </div>;
  }
}