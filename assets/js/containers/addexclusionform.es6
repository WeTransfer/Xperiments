import {connect} from 'react-redux';
import Actions from 'action';
import AddExclusion from 'component/forms/createexperiment/addexclusion';

const list = (experiments, excludedIds) => {
  const list = [];
  experiments.forEach(experiment => {
    if (excludedIds.indexOf(experiment.id) === -1)
      list.push(experiment);
  });

  return list;
};

const mapStateToProps = (state) => {
  return {
    list: list(state.experiments.list, [state.experiment.data.id]),
    currentlyExcluded: state.experiment.data.exclusions
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    set: exclusions => {
      dispatch(Actions.Experiment.setValues({exclusions}));
      ownProps.onAdd();
    }
  };
};

const AddExclusionForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddExclusion);

export default AddExclusionForm;