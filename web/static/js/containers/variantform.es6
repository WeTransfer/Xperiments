import Store from 'store/index.es6';
import {connect} from 'react-redux';
import Actions from 'action/index.es6';
import VariantForm from 'component/forms/createexperiment/variantform.es6';

const _allowControlGroupSelection = (variants = []) => {
  let has = true;
  variants.forEach((element) => {
    if (element.control_group == true)
      has = false;
  })
  return has;
}

const mapStateToProps = (state, newProps) => {
  let allowControlGroupSelection = _allowControlGroupSelection(state.experiment.data.variants);
  
  if (Object.keys(newProps.variant).length && newProps.variant.control_group)
    allowControlGroupSelection = true;

  return {
    allowControlGroupSelection: allowControlGroupSelection,
    validationErrors: state.validationerrors.variantForm
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    set: data => {
      dispatch(Actions.Experiment.pushVariant(data, 'variantForm'))
      ownProps.onAdd();
    },
    update: (data, variant) => {
      dispatch(Actions.Experiment.updateVariant(data, variant, 'variantForm'));
      ownProps.onAdd();
    },
    cancel: () => {
      dispatch(Actions.ValidationErrors.reset('variantForm'));
      ownProps.onCancel();
    }
  }
}

const VariantFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(VariantForm);

export default VariantFormContainer;