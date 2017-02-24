import Store from 'store/index.es6';
import {connect} from 'react-redux';
import Actions from 'action/index.es6';
import VariantForm from 'component/forms/createexperiment/variantform.es6';

const FORM_NAME = 'variantForm';
let setValuesFromProperty = true;

const setValue = (key, value) => {
  let data = {};
  data[key] = value;
  console.log(data);
  return Actions.NewVariant.setValues(data);
}

const _allowControlGroupSelection = (variants = []) => {
  let has = true;
  variants.forEach((element) => {
    if (element.control_group == true)
      has = false;
  })
  return has;
}

const mapStateToProps = (state, ownProps) => {
  let allowControlGroupSelection = _allowControlGroupSelection(state.experiment.data.variants);

  console.log(setValuesFromProperty);
  if (setValuesFromProperty) {
    state.newvariant = Object.assign(state.newvariant, ownProps.variant);
    state.newvariant.payload = JSON.parse(ownProps.variant.payload);
    setValuesFromProperty = false;

    if (ownProps.variant.control_group)
      allowControlGroupSelection = true;
  }
  
  return {
    variant: state.newvariant,
    allowControlGroupSelection: allowControlGroupSelection,
    validationErrors: state.validationerrors[FORM_NAME]
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    editing: true,
    setName: value => {dispatch(setValue('name', value));},
    setAllocation: value => {dispatch(setValue('allocation', value));},
    setControlGroup: value => {dispatch(setValue('control_group', value));},
    setPayload: value => {dispatch(setValue('payload', value));},
    setDescription: value => {dispatch(setValue('description', value));},
    set: newData => {
      dispatch(Actions.NewVariant.validate(newData, FORM_NAME));
      dispatch(Actions.Experiment.updateVariant(newData, ownProps.variant));
      dispatch(Actions.NewVariant.reset());
      setValuesFromProperty = true;
      ownProps.onAdd();
    },
    cancel: () => {
      dispatch(Actions.ValidationErrors.reset(FORM_NAME));
      dispatch(Actions.NewVariant.reset());
      ownProps.onCancel();

      setValuesFromProperty = true;
    },
    unsetValidationError: fieldName => {
      dispatch(Actions.ValidationErrors.unset(fieldName, FORM_NAME));
    }
  }
}

const EditVariantFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(VariantForm);

export default EditVariantFormContainer;