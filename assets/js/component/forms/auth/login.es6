import React from 'react';

import Form from 'component/form';

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

export default class Login extends Form {
  static propTypes = {
    setEmail: React.PropTypes.func,
    setPassword: React.PropTypes.func,
    submit: React.PropTypes.func,
    validationErrors: React.PropTypes.object,
    unsetValidationError: React.PropTypes.func
  };

  render() {
    return <div className="form__login">
      <form action="/auth/login" method="POST">
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
              type="submit"
              label="Signin"
              primary={true}
              disabled={false}
              onTouchTap={this.props.submit}
            />
          </div>
        </div>
      </form>
    </div>;
  }
}
