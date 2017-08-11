import React from 'react';
import LoginForm from 'component/forms/auth/login';

export default class AuthPage extends React.Component {
  static propTypes= {
    setEmail: React.propTypes.func,
    setPassword: React.propTypes.func,
    login: React.propTypes.func
  };

  render() {
    return <div className="page__auth">
      <LoginForm
        setEmail={this.props.setEmail}
        setPassword={this.props.setPassword}
        submit={this.props.login}
      />
    </div>;
  }
}
