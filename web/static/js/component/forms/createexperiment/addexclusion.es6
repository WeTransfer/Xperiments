import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

const styling = {
  checkbox: {
    marginTop: 30
  },
  flatButton: {
    marginRight: 10
  }
};

export default class AddExclusion extends React.Component {
  static propTypes = {
    set: React.PropTypes.func,
    onCancel: React.PropTypes.func,
    onAdd: React.PropTypes.func
  }

  handleAdd = () => {
    // this.props.set();
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

    return <div className="form__add-exclusion">
      <Dialog title="Add Exclusion" actions={actions} modal={true} open={this.props.open}>
        <div className="row">
          <div className="col-md-12">
            <TextField defaultValue="" floatingLabelText="Name" ref="name" />
          </div>
        </div>
      </Dialog>
    </div>;
  }
}