import React from 'react';

import Form from 'component/form.es6';

import VariantPayloadOptions from 'variantpayloadoptions.es6';
import PayloadEditor from './payloadeditor.es6';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/SelectField';
import Checkbox from 'material-ui/Checkbox';

const styling = {
  checkbox: {
    marginTop: 30
  },
  flatButton: {
    marginRight: 10
  }
};

export default class VariantForm extends Form {
  static propTypes = {
    variant: React.PropTypes.object,
    set: React.PropTypes.func,
    setName: React.PropTypes.func,
    setAllocation: React.PropTypes.func,
    setControlGroup: React.PropTypes.func,
    setPayload: React.PropTypes.func,
    setDescription: React.PropTypes.func,
    cancel: React.PropTypes.func,
    onAdd: React.PropTypes.func,
    allowControlGroupSelection: React.PropTypes.bool,
    validationErrors: React.PropTypes.object,
    unsetValidationError: React.PropTypes.func
  }

  constructor(props) {
    super(props);
  }

  handleAdd = () => {
    this.props.set(this.props.variant);
  }

  handleChangeInPayloadEditor= value => {
    this.props.setPayload(value);
    this.unsetError('payload');
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
        label={this.props.editing ? 'Update' : 'Add'}
        primary={true}
        disabled={false}
        onTouchTap={this.handleAdd}
      />
    ];

    return <div className="form__variant">
      <Dialog
        title={`${this.props.editing ? 'Edit' : 'Add'} Variant`}
        actions={actions}
        modal={true}
        open={this.props.open}
        repositionOnUpdate={true}
        autoScrollBodyContent={true}
      >
        <div className="row">
          <div className="col-md-12">
            <TextField
              defaultValue={this.props.variant.name}
              floatingLabelText="Name*"
              errorText={this.getError('name')}
              onChange={(e, value) => {
                this.props.setName(value);
                this.unsetError('name');
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-5">
            <TextField
              defaultValue={this.props.variant.allocation}
              floatingLabelText="Allocation (%)*"
              errorText={this.getError('allocation')}
              onChange={(e, value) => {
                this.props.setAllocation(parseFloat(value));
                this.unsetError('allocation');
              }}
            />
          </div>
          <div className="col-md-7">
            <Checkbox
              defaultChecked={this.props.variant.control_group || false}
              label="Control Group"
              style={styling.checkbox}
              disabled={!this.props.allowControlGroupSelection}
              onCheck={(e, value) => {
                this.props.setControlGroup(value);
              }}
            />
          </div>
        </div>
        <PayloadEditor
          types={VariantPayloadOptions.web}
          validationErrors={this.props.validationErrors}
          unsetValidationError={this.props.unsetValidationError}
          value={this.props.variant.payload}
          onChange={this.handleChangeInPayloadEditor}
          key="payloadeditor"
        />
      </Dialog>
    </div>;
  }
}