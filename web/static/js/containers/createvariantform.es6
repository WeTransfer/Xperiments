import {connect} from 'react-redux';
import Actions from 'action';
import VariantForm from 'component/forms/createexperiment/variantform';

const FORM_NAME = 'variantForm';

const setValue = (key, value) => {
  let data = {};
  data[key] = value;
  return Actions.NewVariant.setValues(data);
};

const _allowControlGroupSelection = (variants = []) => {
  let has = true;
  variants.forEach((element) => {
    if (element.control_group === true)
      has = false;
  });
  return has;
};

const mapStateToProps = state => {
  return {
    variant: state.newvariant,
    allowControlGroupSelection: _allowControlGroupSelection(state.experiment.data.variants),
    validationErrors: state.validationerrors[FORM_NAME]
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setName: value => dispatch(setValue('name', value)),
    setAllocation: value => dispatch(setValue('allocation', value)),
    setControlGroup: value => dispatch(setValue('control_group', value)),
    setPayload: value => dispatch(setValue('payload', value)),
    setDescription: value => dispatch(setValue('description', value)),
    set: data => {
      dispatch(Actions.NewVariant.validate(data, FORM_NAME));
      dispatch(Actions.Experiment.pushVariant(data));
      dispatch(Actions.NewVariant.reset());
      ownProps.onAdd();
    },
    cancel: () => {
      dispatch(Actions.ValidationErrors.reset(FORM_NAME));
      dispatch(Actions.NewVariant.reset());
      ownProps.onCancel();
    },
    unsetValidationError: fieldName => {
      dispatch(Actions.ValidationErrors.unset(fieldName, FORM_NAME));
    }
  };
};

const VariantFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(VariantForm);

export default VariantFormContainer;