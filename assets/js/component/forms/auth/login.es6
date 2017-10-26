import React from 'react';

import Form from 'component/form';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

export default class Login extends Form {
  static propTypes = {
    auth: React.PropTypes.object,
    setEmail: React.PropTypes.func,
    setPassword: React.PropTypes.func,
    submit: React.PropTypes.func,
    validationErrors: React.PropTypes.object,
    unsetValidationError: React.PropTypes.func
  };

  submit() {
    this.props.submit(this.props.auth);
  }

  render() {
    return <div className="form__login">
        <div className="row">
          <div className="col-md-12">
            <TextField
              name="email"
              fullWidth={true}
              floatingLabelText="Email"
              onChange={(e, value) => {
                this.props.setEmail(value);
                this.unsetError('email');
              }}
              errorText={this.getError('username')}
            />
          </div>
          <div className="col-md-12">
            <TextField
              name="password"
              fullWidth={true}
              floatingLabelText="Password"
              onChange={(e, value) => {
                this.props.setPassword(value);
                this.unsetError('password');
              }}
              errorText={this.getError('password')}
              type="password"
            />
          </div>
          <div className="col-md-12">
            <RaisedButton
              label="Signin"
              primary={true}
              disabled={false}
              onTouchTap={() => {
                this.submit();
              }}
            />
          </div>
        </div>
    </div>;
  }
}
