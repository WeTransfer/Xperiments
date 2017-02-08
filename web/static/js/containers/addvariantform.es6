import Store from 'store/index.es6';
import {connect} from 'react-redux';
import Actions from 'action/index.es6';
import AddVariant from 'component/forms/createexperiment/addvariant.es6';

const allowControlGroupSelection = (variants = []) => {
  let has = true;
  variants.forEach((element) => {
    if (element.control_group == true)
      has = false;
  })
  return has;
}

const mapStateToProps = (state) => {
  return {
    allowControlGroupSelection: allowControlGroupSelection(state.experiment.data.variants)
  };
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    set: data => {
      dispatch(Actions.Experiment.pushVariant(data))
      ownProps.onAdd();
    }
  }
}

const AddVariantForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddVariant);

export default AddVariantForm;