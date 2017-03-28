import React from 'react';

import Form from 'component/form';

import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class PayloadEditor extends Form {
  static propTypes = {
    types: React.PropTypes.array,
    errors: React.PropTypes.object,
    onChange: React.PropTypes.func,
    value: React.PropTypes.string,
    validationErrors: React.PropTypes.object,
    unsetValidationError: React.PropTypes.func
  }

  getPayloadType() {
    return Object.keys(this.props.value)[0];
  }

  setType(index, type) {
    let payload = {};

    try {
      payload[type] = this.props.types[type].defaults;
    } catch (e) {
      // throw
    }

    this.props.onChange(payload);
  }

  setPayload(key, type, value) {
    const payloadType = this.getPayloadType();
    let payload = {};
    payload[payloadType] = Object.assign({}, this.props.value[payloadType]);
    
    if (type === 'number')
      payload[payloadType][key] = parseInt(value);
    else
      payload[payloadType][key] = value;

    this.props.onChange(payload);
  }

  handlePropertyChange = (property, type, value) => {
    this.setPayload(property.key, type, value);
    this.props.unsetValidationError(`payload_${property.key}`);
  }

  skipPropertyField(property, rules) {
    const when = rules.requiredWhen;
    if (!when) return false;
    
    let whenFieldValue =this.props.value[this.getPayloadType()][when.field];
    
    if (typeof when.value === 'string' && whenFieldValue === when.value) return false;

    if (typeof when.value === 'object' && when.value.indexOf(whenFieldValue) !== -1) return false;

    return true;
  }

  makePropertyField(property, rules) {
    let payloadType = Object.keys(this.props.value)[0];
    let propertyValue = this.props.value[payloadType][property.key];

    let errorText = this.getError(`payload_${property.key}`);

    if (propertyValue === undefined || propertyValue === null) {
      if (rules.type === 'string')
        propertyValue = '';
      else
        propertyValue = null;
    }

    if (this.skipPropertyField(property, rules)) return null;

    let propertyField = null;
    if ((rules.type === 'string' || rules.type === 'number') && !property.enum) {
      propertyField = <div className="col-md-12">
        <TextField
          errorText={errorText}
          fullWidth={true}
          onChange={(e, value) => this.handlePropertyChange(property, rules.type, value)}
          floatingLabelText={property.title}
          disabled={!!property.disabled}
          value={propertyValue}
          key={`textfield-${rules.type}-${property.key}`}
          {...property.uiOptions}
        />
      </div>;
    } else {
      let options = [];
      property.enum.forEach(option => {
        options.push(<MenuItem value={option.value} primaryText={option.label} />);
      });

      propertyField = <div className="col-md-12">
        <SelectField
          errorText={errorText}
          fullWidth={true}
          floatingLabelText={property.title}
          value={propertyValue}
          onChange={(e, index, value) => this.handlePropertyChange(property, rules.type, value)}
          key={`selectfield-${rules.type}-${property.key}`}
          disabled={!!property.disabled}
          {...property.uiOptions}
        >
          {options}
        </SelectField>
      </div>;
    }

    return propertyField;
  }

  render() {
    let payloadType = Object.keys(this.props.value)[0];
    let typeOptions = [];
    let selectedType = null;

    Object.keys(this.props.types).forEach(key => {
      const type = this.props.types[key];
      
      if (type.disabled) return; // disabled
      
      if (type.key === payloadType)
        selectedType = type;

      typeOptions.push(<MenuItem
        value={type.key}
        primaryText={type.name}
      />);
    });

    let typeFields = [];
    if (selectedType !== null) {
      selectedType.schema.properties.forEach(property => {
        if (property.hidden === true)
          return;
        typeFields.push(this.makePropertyField(property, selectedType.schema.rules[property.key]));
      });
    }

    return <div className="form__payload-editor">
      <div className="row">
        <div className="col-md-12">
          <SelectField
            fullWidth={true}
            floatingLabelText="Type*"
            value={payloadType}
            onChange={(e, index, value) => {
              this.setType(index, value);
              this.props.unsetValidationError('payload_type');
            }}
            errorText={this.getError('payload_type')}
            key="selectfield-payload-type"
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