import React from 'react';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';

import AddRuleForm from 'containers/addruleform.es6';

import RuleParameters from 'ruleparameters.es6';
import RuleOperatorsByType from 'ruleoperatorsbytype.es6';
import Countries from 'countries.es6';
import Languages from 'languages.es6';
import Devices from 'devices.es6';

import globalStyling from 'globalstyling.es6';

const styling = {
  ...globalStyling
};

export default class Rules extends React.Component {
  static propTypes = {
    title: React.PropTypes.string,
    list: React.PropTypes.array,
    delete: React.PropTypes.func,
    readOnly: React.PropTypes.boolean
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
    let actionsRow = null;
    if (!this.props.readOnly)
      actionsRow = <TableRowColumn>{this.getActions(rule)}</TableRowColumn>;

    return <TableRow>
      <TableRowColumn>{this.getParameterLabel(rule.parameter)}</TableRowColumn>
      <TableRowColumn>{this.getOperatorLabel(rule.operator, rule.type)}</TableRowColumn>
      <TableRowColumn>{this.getValueLabel(rule.value, rule.parameter)}</TableRowColumn>
      {actionsRow}
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

    let actionsRow = null;
    let addRule = null;
    if (!this.props.readOnly) {
      actionsRow = <TableHeaderColumn>Actions</TableHeaderColumn>;
      addRule = [
        <RaisedButton label="add rule" secondary={true} onTouchTap={this.showAddRule} className="pull-right" />,
        <AddRuleForm
          open={this.state.isAddRuleVisible}
          onCancel={this.hideAddRule}
          onAdd={this.hideAddRule}
        />
      ];
    }


    return <div className="form__rules">
      <div className="row">
        <div className="col-md-6"><h4>{this.props.title}</h4></div>
        <div className="col-md-6">
          {addRule}
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
                {actionsRow}
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>{renderedList}</TableBody>
          </Table>
        </div>
      </div>
    </div>;
  }
}