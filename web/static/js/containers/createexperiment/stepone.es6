import { connect } from 'react-redux';
import Actions from 'action/index.es6';
import CreateExperimentStepOneForm from 'component/forms/createexperiment/stepone.es6';

const setValue = (key, value) => {
  let data = {};
  data[key] = value;
  return Actions.Experiment.setValues(data);
}

const mapStateToProps = (state) => {
  return {
    experiment: state.experiment
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setName: value => {dispatch(setValue('name', value))},
    setStartDate: value => {dispatch(setValue('startDate', value))},
    setStartTime: value => {dispatch(setValue('startTime', value))},
    setEndDate: value => {dispatch(setValue('endDate', value))},
    setEndTime: value => {dispatch(setValue('endTime', value))},
    setDescription: value => {dispatch(setValue('description', value))},
    save: (data) => {
      dispatch(Actions.Experiment.create(data));
      ownProps.onSave();
    },
    cancel: ownProps.onClose
  }
}

const CreateExperimentStepOne = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateExperimentStepOneForm);

export default CreateExperimentStepOne;