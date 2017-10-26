import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import UserForm from './userform';

import globalStyling from 'globalstyling';

const styling = {
  ...globalStyling
};

export default class AddUser extends React.Component {
  static propTypes = {
    user: React.PropTypes.object,
    experiment: React.PropTypes.object,
    setName: React.PropTypes.func,
    setEmail: React.PropTypes.func,
    setRole: React.PropTypes.func,
    save: React.PropTypes.func,
    cancel: React.PropTypes.func,
    isVisible: React.PropTypes.bool,
    validationErrors: React.PropTypes.object,
    unsetValidationError: React.PropTypes.func
  };

  save = () => {
    this.props.save(this.props.user, 'createUserForm');
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={false}
        disabled={this.props.user.isSaving}
        onTouchTap={this.props.cancel}
        style={styling.flatButton}
      />,
      <RaisedButton
        label="Submit"
        primary={true}
        disabled={this.props.user.isSaving}
        onTouchTap={this.save}
      />
    ];

    return <Dialog
      modal={true}
      actions={actions}
      open={this.props.isVisible}
      title="Create User"
      repositionOnUpdate={true}
      autoScrollBodyContent={true}
    >
      <UserForm
        user={this.props.user}
        setName={this.props.setName}
        setEmail={this.props.setEmail}
        setRole={this.props.setRole}
        validationErrors={this.props.validationErrors}
        unsetValidationError={this.props.unsetValidationError}
      />
    </Dialog>;
  }
}
