import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

const styling = {
  checkbox: {
    marginTop: 30
  }
};

export default class AddVariant extends React.Component {
  static propTypes = {
    onCancel: React.PropTypes.func,
    onAdd: React.PropTypes.func,
    allowControlGroupSelection: React.PropTypes.props
  }

  handleCancel = () => {
    if (this.props.onCancel)
      this.props.onCancel();
  }

  handleAdd = () => {
    if (this.props.onAdd)
      this.props.onAdd(); 
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleCancel}
      />,
      <FlatButton
        label="Add"
        primary={true}
        disabled={true}
        onTouchTap={this.handleAdd}
      />,
    ];

    return <div className="form__create-variant">
      <Dialog title="Add Variant" actions={actions} modal={true} open={this.props.open}>
        <div className="row">
          <div className="col-md-12">
            <TextField defaultValue="" floatingLabelText="Name" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-5">
            <TextField defaultValue="" floatingLabelText="Allocation (%)" />
          </div>
          <div className="col-md-7">
            <Checkbox label="Control Group" style={styling.checkbox} disabled={!this.props.allowControlGroupSelection} />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <TextField
              floatingLabelText="Description"
              multiLine={true}
              rows={3}
              fullWidth={true}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <TextField
              floatingLabelText="Payload"
              multiLine={true}
              rows={4}
              fullWidth={true}
            />
          </div>
        </div>
      </Dialog>
    </div>;
  }
}