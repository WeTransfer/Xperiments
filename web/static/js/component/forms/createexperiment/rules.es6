import React from 'react';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';

import AddRuleForm from 'containers/addruleform.es6';

import RuleParameters from 'ruleparameters.es6';
import RuleOperators from 'ruleoperators.es6';
import Countries from 'countries.es6';
import Languages from 'languages.es6';
import Devices from 'devices.es6';

const styling = {
  emptyTD: {
    textAlign: 'center'
  }
};

export default class Rules extends React.Component {
  static propTypes = {
    title: React.PropTypes.string,
    list: React.PropTypes.array,
    delete: React.PropTypes.func
  };

  state = {
    isAddRuleVisible: false,
    isEditRuleVisible: false
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

  showEditRule = () => {
    this.setState({
      isEditRuleVisible: true
    });
  }

  hideEditRule = () => {
    this.setState({
      isEditRuleVisible: false
    });
  }

  deleteRule(rule) {
    this.props.delete(rule);
  }

  editRule(rule) {
  }

  getParameterLabel(parameterValue) {
    try {
      return RuleParameters[RuleParameters.findIndex(el => el.value === parameterValue)].label;
    } catch (e) {}

    return parameterValue;
  }

  getOperatorLabel(operatorValue) {
    try {
      return RuleOperators[RuleOperators.findIndex(el => el.value === operatorValue)].label;
    } catch (e) {}

    return operatorValue;
  }

  getValueLabel(value, parameter) {
    try {
      switch(parameter) {
        case 'device':
          return Devices[Devices.findIndex(el => el.id === value)].label;
        case 'language':
          return Languages[Languages.findIndex(el => el.id === value)].label;
        case 'country':
          return Countries[Countries.findIndex(el => el.id === value)].label;
        default:
          return value;
      }
    } catch (e) {}

    return value;
  }

  makeRuleRow(rule) {
    return <TableRow>
      <TableRowColumn>{this.getParameterLabel(rule.parameter)}</TableRowColumn>
      <TableRowColumn>{this.getOperatorLabel(rule.operator)}</TableRowColumn>
      <TableRowColumn>{this.getValueLabel(rule.value, rule.parameter)}</TableRowColumn>
      <TableRowColumn>{this.getActions(rule)}</TableRowColumn>
    </TableRow>;
  }

  getActions(rule) {
    let actions = [];
    actions.push(<a href="#" onClick={e => this.props.delete(rule)}>Delete</a>);
    // actions.push(" | ");
    // actions.push(<a href="#" onClick={e => this.editRule(rule)}>Edit</a>);
    return actions;
  }

  render() {
    let renderedList = [];

    this.props.list.forEach(rule => {
      renderedList.push(this.makeRuleRow(rule));
    });

    if (!renderedList.length) {
      renderedList.push(<TableRow>
        <TableRowColumn style={styling.emptyTD} colSpan={5}>No data</TableRowColumn>
      </TableRow>);
    }

    return <div className="form__rules">
      <div className="row">
        <div className="col-md-6"><h5>{this.props.title}</h5></div>
        <div className="col-md-6">
          <RaisedButton label="add rule" secondary={true} onTouchTap={this.showAddRule} className="pull-right" />
          <AddRuleForm
            open={this.state.isAddRuleVisible}
            onCancel={this.hideAddRule}
            onAdd={this.hideAddRule}
          />
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