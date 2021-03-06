import {connect} from 'react-redux';
import Actions from 'action';
import AddRule from 'component/forms/createexperiment/addrule';

const FORM_NAME = 'addRuleForm';

const setValue = (key, value) => {
  let data = {};
  data[key] = value;
  return Actions.NewRule.setValues(data);
};

const mapStateToProps = (state) => {
  return {
    rule: state.newrule,
    validationErrors: state.validationerrors[FORM_NAME]
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setParameter: value => dispatch(setValue('parameter', value)),
    setType: value => dispatch(setValue('type', value)),
    setOperator: value => dispatch(setValue('operator', value)),
    setValue: value => dispatch(setValue('value', value)),
    set: data => {
      dispatch(Actions.NewRule.validate(data, FORM_NAME));
      dispatch(Actions.Experiment.pushRule(data));
      dispatch(Actions.NewRule.reset());
      ownProps.onAdd();
    },
    cancel: () => {
      dispatch(Actions.ValidationErrors.reset(FORM_NAME));
      dispatch(Actions.NewRule.reset());
      ownProps.onCancel();
    },
    unsetValidationError: fieldName => {
      dispatch(Actions.ValidationErrors.unset(fieldName, FORM_NAME));
    }
  };
};

const AddRuleForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddRule);

export default AddRuleForm;