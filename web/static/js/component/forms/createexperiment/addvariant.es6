import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

const styling = {
  checkbox: {
    marginTop: 30
  },
  flatButton: {
    marginRight: 10
  }
};

export default class AddVariant extends React.Component {
  static propTypes = {
    set: React.PropTypes.func,
    onCancel: React.PropTypes.func,
    onAdd: React.PropTypes.func,
    allowControlGroupSelection: React.PropTypes.props
  }

  state = {
    variant: {
      name: '',

    }
  }

  handleAdd = () => {
    this.props.set({
      name: this.refs.name.getValue(),
      allocation: this.refs.allocation.getValue(),
      control_group: this.refs.controlGroup.isChecked(),
      description: this.refs.description.getValue(),
      payload: this.refs.payload.getValue()
    });
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.props.onCancel}
        style={styling.flatButton}
      />,
      <RaisedButton
        label="Add"
        primary={true}
        disabled={false}
        onTouchTap={this.handleAdd}
      />,
    ];

    return <div className="form__create-variant">
      <Dialog title="Add Variant" actions={actions} modal={true} open={this.props.open}>
        <div className="row">
          <div className="col-md-12">
            <TextField defaultValue="" floatingLabelText="Name" ref="name" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-5">
            <TextField defaultValue="" floatingLabelText="Allocation (%)" ref="allocation" />
          </div>
          <div className="col-md-7">
            <Checkbox label="Control Group" style={styling.checkbox} disabled={!this.props.allowControlGroupSelection} ref="controlGroup" />
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <TextField
              floatingLabelText="Description"
              multiLine={true}
              rows={3}
              fullWidth={true}
              ref="description"
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
              ref="payload"
            />
          </div>
        </div>
      </Dialog>
    </div>;
  }
}