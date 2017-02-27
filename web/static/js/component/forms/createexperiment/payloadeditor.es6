import React from 'react';

import Form from 'component/form.es6';

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

  constructor(props) {
    super(props);
  }

  setPayload(key, value, type) {
    let payloadType = Object.keys(this.props.value)[0];
    let payload = {};
    payload[payloadType] = Object.assign({}, this.props.value[payloadType]);
    
    if (type === 'number')
      payload[payloadType][key] = parseInt(value);
    else
      payload[payloadType][key] = value;

    this.props.onChange(payload);
  }

  setType(index, type) {
    let payload = {};

    try {
      payload[type] = this.props.types[index].defaults;
    } catch(e) {
      // throw
    }

    this.props.onChange(payload);
  }

  handlePropertyChange = (property, value) => {
    this.setPayload(property.key, value, property.type);
    this.props.unsetValidationError(`payload_${property.key}`);

    if (property.requires) {
      property.requires.forEach(propertyName => {
        this.props.unsetValidationError(`payload_${propertyName}`);
      })
    }
  }

  makePropertyField(property) {
    let payloadType = Object.keys(this.props.value)[0];
    let propertyValue = this.props.value[payloadType][property.key];

    let errorText = this.getError(`payload_${property.key}`);

    if (propertyValue === undefined || propertyValue === null) {
      if (property.type === 'string')
        propertyValue = '';
      else
        propertyValue = null;
    }
    
    if ((property.type === 'string' || property.type == 'number') && !property.enum) {
      return <div className="col-md-12">
        <TextField
          errorText={errorText}
          fullWidth={true}
          onChange={(e, value) => this.handlePropertyChange(property, value)}
          floatingLabelText={property.title}
          disabled={!!property.disabled}
          value={propertyValue}
          key={`textfield-${property.type}-${property.key}`}
          {...property.uiOptions}
        />
      </div>;
    } else {
      let options = [];
      property.enum.forEach(option => {
        options.push(<MenuItem value={option.value} primaryText={option.label} />);
      })
      return <div className="col-md-12">
        <SelectField
          errorText={errorText}
          fullWidth={true}
          floatingLabelText={property.title}
          value={propertyValue}
          onChange={(e, index, value) => this.handlePropertyChange(property, value)}
          key={`selectfield-${property.type}-${property.key}`}
          disabled={!!property.disabled}
          {...property.uiOptions}
        >
          {options}
        </SelectField>
      </div>;
    }
  }

  render() {
    let payloadType = Object.keys(this.props.value)[0];
    let typeOptions = [];
    let selectedType = null;

    this.props.types.forEach(type => {
      if (type.disabled) return;
      
      if (type.key === payloadType)
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