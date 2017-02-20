import React from 'react';

import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class PayloadEditor extends React.Component {
  state = {
    type: 'none',
    payload: {}
  };

  static propTypes = {
    types: React.PropTypes.array,
    onChange: React.PropTypes.func
  }

  get getPayload() {
    let payload = {};
    payload[this.state.type] = this.state.payload;
    return payload;
  }

  setPayload(key, value, type) {
    let payload = Object.assign({}, this.state.payload);
    payload[key] = value;
    if (type === 'number')
      payload[key] = parseInt(value);
    this.setState({payload});
  }

  setType(index, type) {
    let payload = {};

    try {
      payload = this.props.types[index-1].defaults;
    } catch(e) {
      // throw
    }

    this.setState({type, payload});
  }

  makePropertyField(property) {
    if ((property.type === 'string' && !property.enum) || property.type == 'number') {
      return <div className="col-md-6">
        <TextField
          fullWidth={true}
          onChange={(e, value) => {this.setPayload(property.key, value, property.type);}}
          floatingLabelText={property.title}
          disabled={!!property.disabled}
          value={this.state.payload[property.key] || ''}
          {...property.uiOptions}
        />
      </div>;
    } else if (property.type === 'string' && property.enum) {
      let options = [];
      property.enum.forEach(option => {
        options.push(<MenuItem value={option.value} primaryText={option.label} />);
      })
      return <div className="col-md-6">
        <SelectField
          fullWidth={true}
          floatingLabelText={property.title}
          value={this.state.payload[property.key] || null}
          onChange={(e, index, value) => {this.setPayload(property.key, value, property.type);}}
        >
          {options}
        </SelectField>
      </div>;
    }
  }

  render() {
    let typeOptions = [];
    let selectedType = null;

    this.props.types.forEach(type => {
      if ( type.key === this.state.type)
        selectedType = type;
      typeOptions.push(<MenuItem value={type.key} primaryText={type.name} />)
    });

    let typeFields = [];
    if (selectedType !== null) {
      selectedType.schema.properties.forEach(property => {
        if (property.hidden === true)
          return;
        typeFields.push(this.makePropertyField(property));
      })
    }

    let selectTypeValidation = null;
    if (this.props.errors && typeof this.props.errors === 'string')
      selectTypeValidation = this.props.errors;

    return <div className="form__payload-editor">
      <div className="row">
        <div className="col-md-12">
          <SelectField
            fullWidth={true}
            floatingLabelText="Experiment Type"
            value={this.state.type}
            onChange={(e, index, value) => {this.setType(index, value);}}
            errorText={selectTypeValidation}
          >
            {typeOptions}
          </SelectField>
        </div>
      </div>
      <div className="row">
        {typeFields}
      </div>
    </div>;
  }
}