import React from 'react';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';

import AddRuleForm from 'containers/addruleform';

import RuleParameters from 'ruleparameters';
import RuleOperatorsByType from 'ruleoperatorsbytype';
import Countries from 'countries';
import Languages from 'languages';
import Devices from 'devices';

import globalStyling from 'globalstyling';

const styling = {
  ...globalStyling
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

  getParameterLabel(parameterValue) {
    try {
      return RuleParameters[RuleParameters.findIndex(el => el.value === parameterValue)].label;
    } catch (e) {
      // do something
    }

    return parameterValue;
  }

  getOperatorLabel(operatorValue, ruleType) {
    try {
      return RuleOperatorsByType[ruleType][RuleOperatorsByType.findIndex(el => el.value === operatorValue)].label;
    } catch (e) {
      // do something
    }

    return operatorValue;
  }

  getValueLabel(value, parameter) {
    try {
      switch (parameter) {
        case 'device':
          return Devices[Devices.findIndex(el => el.id === value)].label;
        case 'language':
          return Languages[Languages.findIndex(el => el.id === value)].label;
        case 'country':
          return Countries[Countries.findIndex(el => el.id === value)].label;
        default:
          return value;
      }
    } catch (e) {
      // do something
    }

    return value;
  }

  makeRuleRow(rule) {
    return <TableRow>
      <TableRowColumn>{this.getParameterLabel(rule.parameter)}</TableRowColumn>
      <TableRowColumn>{this.getOperatorLabel(rule.operator, rule.type)}</TableRowColumn>
      <TableRowColumn>{this.getValueLabel(rule.value, rule.parameter)}</TableRowColumn>
      <TableRowColumn>{this.getActions(rule)}</TableRowColumn>
    </TableRow>;
  }

  getActions(rule) {
    let actions = [];
    actions.push(<a onClick={() => {
      this.props.delete(rule);
    }}>Delete</a>);
    return actions;
  }

  render() {
    let renderedList = [];

    this.props.list.forEach(rule => {
      renderedList.push(this.makeRuleRow(rule));
    });

    if (!renderedList.length) {
      renderedList.push(<TableRow>
        <TableRowColumn style={styling.emptyTD} colSpan={5}>No rules</TableRowColumn>
      </TableRow>);
    }

    return <div className="form__rules">
      <div className="row">
        <div className="col-md-6"><h4>{this.props.title}</h4></div>
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