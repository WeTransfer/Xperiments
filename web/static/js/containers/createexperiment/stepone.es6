import Store from 'store/index.es6';
import { connect } from 'react-redux';
import Actions from 'action/index.es6';
import CreateExperimentStepOneForm from 'component/forms/createexperiment/stepone.es6';

const setValue = (key, value) => {
  let data = {};
  data[key] = value;
  return Actions.NewExperiment.setValues(data);
}

const mapStateToProps = (state) => {
  return {
    experiment: state.newexperiment
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setName: value => {dispatch(setValue('name', value))},
    setStartDate: value => {dispatch(setValue('start_date', value))},
    setStartTime: value => {dispatch(setValue('start_date', value))},
    setEndDate: value => {dispatch(setValue('end_date', value))},
    setEndTime: value => {dispatch(setValue('end_date', value))},
    setDescription: value => {dispatch(setValue('description', value))},
    save: (data) => {
      dispatch(Actions.NewExperiment.create(data));
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