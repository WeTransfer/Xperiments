import React from 'react';

import Form from 'component/form';

import RuleParameters from 'ruleparameters';
import RuleOperatorsByType from 'ruleoperatorsbytype';
import RuleTypesByParameter from 'ruletypesbyparameter';
import Countries from 'countries';
import Languages from 'languages';
import Devices from 'devices';
import UserAccountTypes from 'useraccounttypes';
import Browsers from 'browsers';
import Platforms from 'platforms';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import AutoComplete from 'material-ui/AutoComplete';
import SelectField from 'material-ui/SelectField';

import globalStyling from 'globalstyling';

const styling = {
  checkbox: {
    marginTop: 30
  },
  dialog: {
    width: '100%'
  },
  ...globalStyling
};

const dataSource = {
  device: Devices,
  language: Languages,
  country: Countries,
  userAccountType: UserAccountTypes,
  browser: Browsers,
  platform: Platforms
};

export default class AddRule extends Form {
  static propTypes = {
    rule: React.PropTypes.object,
    currentRules: React.PropTypes.array,
    set: React.PropTypes.func,
    cancel: React.PropTypes.func,
    onAdd: React.PropTypes.func,
    setParameter: React.PropTypes.func,
    setType: React.PropTypes.func,
    setOperator: React.PropTypes.func,
    setValue: React.PropTypes.func,
    open: React.PropTypes.bool,
    validationErrors: React.PropTypes.object,
    unsetValidationError: React.PropTypes.func
  }

  handleAdd = () => {
    this.props.set(this.props.rule);
  }

  getRuleParameters() {
    let items = [<MenuItem value={null} primaryText="" />];
    RuleParameters.forEach(parameter => {
      if (parameter.disabled) return;
      items.push(<MenuItem value={parameter.value} primaryText={parameter.label} />);
    });
    return items;
  }

  getRuleOperators() {
    let items = [];
    
    if (this.props.rule.type) {
      RuleOperatorsByType[this.props.rule.type].forEach(operator => {
        items.push(<MenuItem value={operator.value} primaryText={operator.label} />);
      });
    }

    return items;
  }

  handleValue(value) {
    if (this.props.rule.type && this.props.rule.type === 'number') {
      this.props.setValue(parseInt(value));
    } else {
      this.props.setValue(value);
    }
    this.unsetError('value');
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.props.cancel}
        style={styling.flatButton}
      />,
      <RaisedButton
        label="Add"
        primary={true}
        disabled={false}
        onTouchTap={this.handleAdd}
      />
    ];

    let valueField = null;
    if (dataSource[this.props.rule.parameter]) {
      valueField = <AutoComplete
        fullWidth={true}
        floatingLabelText="Select Value*"
        filter={AutoComplete.caseInsensitiveFilter}
        dataSource={dataSource[this.props.rule.parameter]}
        openOnFocus={true}
        onNewRequest={(request) => {
          this.handleValue(request.id);
        }}
        errorText={this.getError('value')}
        dataSourceConfig={{text: 'label', value: 'id'}}
        maxSearchResults={6}
      />;
    } else {
      let valueType = this.props.rule.type !== null ? `(${this.props.rule.type})` : '';
      valueField = <TextField
        fullWidth={true}
        defaultValue={this.props.value}
        floatingLabelText={`Value* ${valueType}`}
        errorText={this.getError('value')}
        onChange={(e, value) => {
          this.handleValue(value);
        }}
      />;
    }

    return <div className="form__create-rule">
      <Dialog title="Add Rule" actions={actions} modal={true} open={this.props.open} style={styling.dialog}>
        <div className="row">
          <div className="col-md-4">
            <SelectField
              fullWidth={true}
              floatingLabelText="Parameter*"
              value={this.props.rule.parameter}
              onChange={(e, value, payload) => {
                this.props.setType(RuleTypesByParameter[payload]);
                this.props.setParameter(payload);
                this.unsetError('parameter');
              }}
              ref="parameter"
              errorText={this.getError('parameter')}
            >
              {this.getRuleParameters()}
            </SelectField>
          </div>
          <div className="col-md-4">
            <SelectField
              fullWidth={true}
              floatingLabelText="Operator*"
              value={this.props.rule.operator}
              onChange={(e, key, payload) => {
                this.props.setOperator(payload);
                this.unsetError('operator');
              }}
              ref="operator"
              errorText={this.getError('operator')}
            >
              {this.getRuleOperators()}
            </SelectField>
          </div>
          <div className="col-md-4">{valueField}</div>
        </div>
      </Dialog>
    </div>;
  }
}