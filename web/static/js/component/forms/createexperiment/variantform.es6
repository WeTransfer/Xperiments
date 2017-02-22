import React from 'react';

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

export default class VariantForm extends React.Component {
  static propTypes = {
    set: React.PropTypes.func,
    update: React.PropTypes.func,
    cancel: React.PropTypes.func,
    onAdd: React.PropTypes.func,
    allowControlGroupSelection: React.PropTypes.props,
    validationErrors: React.PropTypes.object,
    variant: React.PropTypes.object
  }

  handleAdd = () => {
    let newData = {
      name: this.refs.name.getValue(),
      allocation: this.refs.allocation.getValue(),
      control_group: this.refs.controlGroup.isChecked(),
      description: this.refs.description.getValue(),
      payload: this.refs.payloadeditor.getPayload
    };

    if (Object.keys(this.props.variant).length)
      this.props.update(newData, this.props.variant);
    else
      this.props.set(newData);
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
        label={Object.keys(this.props.variant).length ? 'Update' : 'Add'}
        primary={true}
        disabled={false}
        onTouchTap={this.handleAdd}
      />
    ];

    return <div className="form__variant">
      <Dialog title="Add Variant" actions={actions} modal={true} open={this.props.open} repositionOnUpdate={true}>
        <div className="row">
          <div className="col-md-12">
            <TextField
              defaultValue={this.props.variant.name || ""}
              floatingLabelText="Name"
              ref="name"
              errorText={this.props.validationErrors.name || null}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-5">
            <TextField
              defaultValue={this.props.variant.allocation || ""}
              floatingLabelText="Allocation (%)"
              ref="allocation"
              errorText={this.props.validationErrors.allocation || null}
            />
          </div>
          <div className="col-md-7">
            <Checkbox
              defaultChecked={this.props.variant.control_group || false}
              label="Control Group"
              style={styling.checkbox}
              disabled={!this.props.allowControlGroupSelection}
              ref="controlGroup"
            />
          </div>
        </div>
        <PayloadEditor
          types={VariantPayloadOptions.web}
          ref="payloadeditor"
          errors={this.props.validationErrors.payload || null}
          value={this.props.variant.payload || null}
          key="payloadeditor"
        />
        <div className="row">
          <div className="col-md-12">
            <TextField
              defaultValue={this.props.variant.description || ""}
              floatingLabelText="Description"
              multiLine={true}
              rows={3}
              fullWidth={true}
              ref="description"
              errorText={this.props.validationErrors.description || null}
            />
          </div>
        </div>
      </Dialog>
    </div>;
  }
}