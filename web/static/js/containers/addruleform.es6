import Store from 'store/index.es6';
import {connect} from 'react-redux';
import Actions from 'action/index.es6';
import AddRule from 'component/forms/createexperiment/addrule.es6';

const setValue = (key, value) => {
  let data = {};
  data[key] = value;
  return Actions.NewRule.setValues(data);
}

const mapStateToProps = (state) => {
  return {
    rule: state.newrule,
    validationErrors: state.validationerrors.addRuleForm
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setParameter: value => {dispatch(setValue('parameter', value))},
    setType: value => {dispatch(setValue('type', value))},
    setOperator: value => {dispatch(setValue('operator', value))},
    setValue: value => {dispatch(setValue('value', value))},
    set: data => {
      dispatch(Actions.NewRule.validate(data, 'addRuleForm'));
      dispatch(Actions.Experiment.pushRule(data));
      dispatch(Actions.NewRule.reset());
      ownProps.onAdd();
    },
    unset: () => {}
  }
}

const AddRuleForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddRule);

export default AddRuleForm;