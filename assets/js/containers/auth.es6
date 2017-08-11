import { connect } from 'react-redux';
import Actions from 'action';

import AuthPage from 'component/page/auth';

const FORM_NAME = 'loginForm';

const setValue = (key, value) => {
  let data = {};
  data[key] = value;
  return Actions.Auth.setValues(data);
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    validationErrors: state.validationerrors[FORM_NAME]
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setEmail: value => dispatch(setValue('email', value)),
    setPassword: value => dispatch(setValue('password', value)),
    login: data => {
      dispatch(Actions.Auth.create(data, FORM_NAME));
    },
    unsetValidationError: fieldName => {
      dispatch(Actions.ValidationErrors.unset(fieldName, FORM_NAME));
    }
  };
};

const Auth = connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthPage);

export default Auth;