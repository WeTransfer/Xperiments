import React from 'react';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';

import AddRuleForm from 'containers/addruleform.es6';

const styling = {
  emptyTD: {
    textAlign: 'center'
  }
};

export default class AddSegments extends React.Component {
  static propTypes = {
    title: React.PropTypes.string,
    list: React.PropTypes.array
  };

  state = {
    isAddRuleVisible: false
  }

  showAddRule = () => {
    this.setState({
      isAddRuleVisible: true
    });
  }

  hideAddRule = () => {
    this.setState({
      isAddRuleVisible: false
    });
  }

  render() {
    let renderedList = [];

    this.props.list.forEach(rule => {
      renderedList.push(<TableRow>
        <TableRowColumn>{rule.parameter}</TableRowColumn>
        <TableRowColumn>{rule.operator}</TableRowColumn>
        <TableRowColumn>{rule.value}</TableRowColumn>
        <TableRowColumn>-</TableRowColumn>
      </TableRow>);
    });

    if (!renderedList.length) {
      renderedList.push(<TableRow>
        <TableRowColumn style={styling.emptyTD} colSpan={5}>No data</TableRowColumn>
      </TableRow>);
    }

    return <div className="form__add-segments">
      <div className="row">
        <div className="col-md-6"><h5>{this.props.title}</h5></div>
        <div className="col-md-6">
          <RaisedButton label="add rule" secondary={true} onTouchTap={this.showAddRule} className="pull-right" />
          <AddRuleForm open={this.state.isAddRuleVisible} onCancel={this.hideAddRule} onAdd={this.hideAddRule} />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <Table>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>Parameter</TableHeaderColumn>
                <TableHeaderColumn>Operator</TableHeaderColumn>
                <TableHeaderColumn>Value</TableHeaderColumn>
                <TableHeaderColumn>Actions</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>{renderedList}</TableBody>
          </Table>
        </div>
      </div>
    </div>;
  }
}