import React from 'react';

import UserRoles from 'userroles';

import Form from 'component/form';

import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import Helper from 'helper';

export default class UserForm extends Form {
  static propTypes = {
    user: React.PropTypes.object,
    setName: React.PropTypes.func,
    setEmail: React.PropTypes.func,
    setRole: React.PropTypes.func,
    validationErrors: React.PropTypes.object,
    unsetValidationError: React.PropTypes.func
  };

  getUserRoles() {
    let items = [];
    
    UserRoles.forEach(role => {
      items.push(<MenuItem value={role.value} primaryText={role.label} />);
    });

    return items;
  }

  render() {
    return <div className="form__create-user">
      <div className="row">
        <div className="col-md-12">
          <TextField
            fullWidth={true}
            defaultValue={this.props.user.name || ''}
            floatingLabelText="Name"
            onChange={(e, value) => {
              this.props.setName(value);
              this.unsetError('name');
            }}
            errorText={this.getError('name')}
          />
        </div>
        <div className="col-md-12">
          <TextField
            fullWidth={true}
            defaultValue={this.props.user.email || ''}
            floatingLabelText="Email"
            onChange={(e, value) => {
              this.props.setEmail(value);
              this.unsetError('email');
            }}
            errorText={this.getError('email')}
          />
        </div>
        <div className="col-md-12">
          <SelectField
            fullWidth={true}
            floatingLabelText="Role*"
            value={this.props.user.role}
            onChange={(e, key, payload) => {
              this.props.setRole(payload);
              this.unsetError('role');
            }}
            ref="role"
            errorText={this.getError('role')}
          >
            {this.getUserRoles()}
          </SelectField>
        </div>
      </div>
    </div>;
  }
}
