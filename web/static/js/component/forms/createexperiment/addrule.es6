import React from 'react';

import Countries from 'countries.es6';
import Languages from 'languages.es6';

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
  device: [{label: 'Desktop', id: 'desktop'}, {label: 'Mobile', id: 'mobile'}],
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
    open: React.PropTypes.bool,
    validationErrors: React.PropTypes.object
  }

  handleAdd = () => {
    this.props.set(this.props.rule);
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

    let selectedDataSource = [];
    if (dataSource[this.props.rule.parameter])
      selectedDataSource = dataSource[this.props.rule.parameter];

    return <div className="form__create-rule">
      <Dialog title="Add Rule" actions={actions} modal={true} open={this.props.open} style={styling.dialog}>
        <div className="row">
          <div className="col-md-6">
            <SelectField
              fullWidth={true}
              floatingLabelText="Parameter"
              value={this.props.rule.parameter}
              onChange={(e, key, payload) => {this.props.setParameter(payload);}}
              ref="parameter"
              errorText={this.props.validationErrors.parameter || null}
            >
              <MenuItem value={null} primaryText="" />
              <MenuItem value="device" primaryText="Device" />
              <MenuItem value="language" primaryText="Language" />
              <MenuItem value="country" primaryText="Country" />
            </SelectField>
          </div>
          <div className="col-md-6">
            <AutoComplete
              fullWidth={true}
              floatingLabelText="Value"
              filter={AutoComplete.caseInsensitiveFilter}
              dataSource={selectedDataSource}
              openOnFocus={true}
              ref="value"
              onNewRequest={(request) => {this.props.setValue(request.id);}}
              errorText={this.props.validationErrors.value || null}
              dataSourceConfig={{text: 'label', value: 'id'}}
              maxSearchResults={5}
            />
          </div>
        </div>
      </Dialog>
    </div>;
  }
}