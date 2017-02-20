import React from 'react';

import RuleParameters from 'ruleparameters.es6';
import RuleOperators from 'ruleoperators.es6';
import Countries from 'countries.es6';
import Languages from 'languages.es6';
import Devices from 'devices.es6';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import MenuItem from 'material-ui/MenuItem';
import AutoComplete from 'material-ui/AutoComplete';
import SelectField from 'material-ui/SelectField';

const styling = {
  checkbox: {
    marginTop: 30
  },
  dialog: {
    width: '100%'
  },
  flatButton: {
    marginRight: 10
  }
};

const dataSource = {
  device: Devices,
  language: Languages,
  country: Countries
};

export default class AddRule extends React.Component {
  static propTypes = {
    rule: React.PropTypes.object,
    currentRules: React.PropTypes.array,
    set: React.PropTypes.func,
    cancel: React.PropTypes.func,
    onAdd: React.PropTypes.func,
    setParameter: React.PropTypes.func,
    setOperator: React.PropTypes.func,
    setValue: React.PropTypes.func,
    open: React.PropTypes.bool,
    validationErrors: React.PropTypes.object
  }

  handleAdd = () => {
    this.props.set(this.props.rule);
  }

  getRuleParameters() {
    let items = [<MenuItem value={null} primaryText="" />];
    RuleParameters.forEach(parameter => {
      items.push(<MenuItem value={parameter.value} primaryText={parameter.label} />);
    });
    return items;
  }

  getRuleOperators() {
    let items = [];
    RuleOperators.forEach(operator => {
      items.push(<MenuItem value={operator.value} primaryText={operator.label} />);
    });
    return items;
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
      />,
    ];

    let valueField = null;
    let operatorFieldIsDisabled = true;
    if (dataSource[this.props.rule.parameter]) {
      valueField = <AutoComplete
        fullWidth={true}
        floatingLabelText="Value"
        filter={AutoComplete.caseInsensitiveFilter}
        dataSource={dataSource[this.props.rule.parameter]}
        openOnFocus={true}
        ref="value"
        onNewRequest={(request) => {this.props.setValue(request.id);}}
        errorText={this.props.validationErrors.value || null}
        dataSourceConfig={{text: 'label', value: 'id'}}
        maxSearchResults={5}
      />;
    } else {
      valueField = <TextField
        fullWidth={true}
        defaultValue={this.props.value}
        floatingLabelText="Value"
        ref="value"
        errorText={this.props.validationErrors.value || null}
        onChange={(e, value) => {this.props.setValue(value);}}
      />;
      operatorFieldIsDisabled = false;
    }

    return <div className="form__create-rule">
      <Dialog title="Add Rule" actions={actions} modal={true} open={this.props.open} style={styling.dialog}>
        <div className="row">
          <div className="col-md-4">
            <SelectField
              fullWidth={true}
              floatingLabelText="Parameter"
              value={this.props.rule.parameter}
              onChange={(e, value, payload) => {this.props.setParameter(payload);}}
              ref="parameter"
              errorText={this.props.validationErrors.parameter || null}
            >
              {this.getRuleParameters()}
            </SelectField>
          </div>
          <div className="col-md-4">
            <SelectField
              fullWidth={true}
              floatingLabelText="Operator"
              value={this.props.rule.operator}
              onChange={(e, key, payload) => {this.props.setOperator(payload);}}
              ref="operator"
              errorText={this.props.validationErrors.operator || null}
              fullWidth={true}
              disabled={operatorFieldIsDisabled}
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