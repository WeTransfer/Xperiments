import {connect} from 'react-redux';
import Actions from 'action';
import AddUser from 'component/forms/user/adduser';

const FORM_NAME = 'createUserForm';

const setValue = (key, value, dispatch) => {
  let data = {};
  data[key] = value;
  dispatch(Actions.NewUser.setValues(data));
};

const mapStateToProps = (state) => {
  return {
    user: state.newuser,
    validationErrors: state.validationerrors[FORM_NAME]
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setName: value => setValue('name', value, dispatch),
    setEmail: value => setValue('email', value, dispatch),
    setRole: value => setValue('role', value, dispatch),
    save: async (data, formName) => {
      await dispatch(Actions.NewUser.create(data, formName));
      ownProps.onClose();
    },
    cancel: () => {
      Actions.ValidationErrors.reset(FORM_NAME);
      ownProps.onClose();
    },
    unsetValidationError: fieldName => {
      dispatch(Actions.ValidationErrors.unset(fieldName, FORM_NAME));
    }
  };
};

const CreateUser = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddUser);

export default CreateUser;