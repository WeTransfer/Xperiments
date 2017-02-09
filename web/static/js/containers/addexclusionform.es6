import Store from 'store/index.es6';
import {connect} from 'react-redux';
import Actions from 'action/index.es6';
import AddExclusion from 'component/forms/createexperiment/addexclusion.es6';

const mapStateToProps = (state) => {
  return {};
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    set: experimentId => {
      dispatch(Actions.Experiment.pushExclusion(experimentId))
      ownProps.onAdd();
    }
  }
}

const AddExclusionForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddExclusion);

export default AddExclusionForm;