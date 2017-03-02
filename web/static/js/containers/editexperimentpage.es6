import {connect} from 'react-redux';
import Actions from 'action/index.es6';
import EditExperimentPage from 'component/page/editexperiment.es6';

const FORM_NAME = 'editExperimentForm';
let cachedSelectedApplication = null;

const setValue = (key, value) => {
  let data = {};
  data[key] = value;
  return Actions.Experiment.setValues(data);
};

const getSelectedApplication = (applications, user) => {
  if (cachedSelectedApplication) return cachedSelectedApplication;
  applications.forEach(application => {
    if (application.id === user.selectedApplication)
      cachedSelectedApplication = application;
  });
  return cachedSelectedApplication;
};

const mapStateToProps = (state) => {
  return {
    selectedApplication: getSelectedApplication(state.applications.list, state.user),
    experiment: state.experiment,
    indexedExperimentsList: state.experiments.indexedList,
    validationErrors: state.validationerrors[FORM_NAME]
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setName: value => dispatch(setValue('name', value)),
    setStartDate: value => dispatch(setValue('start_date', value)),
    setStartTime: value => dispatch(setValue('start_date', value)),
    setEndDate: value => dispatch(setValue('end_date', value)),
    setEndTime: value => dispatch(setValue('end_date', value)),
    setDescription: value => dispatch(setValue('description', value)),
    setSamplingRate: value => dispatch(setValue('sampling_rate', value)),
    setMaxUsers: value => dispatch(setValue('max_users', value)),
    save: data => dispatch(Actions.Experiment.update(data, FORM_NAME)),
    deleteRule: rule => dispatch(Actions.Experiment.popRule(rule)),
    deleteVariant: variant => dispatch(Actions.Experiment.popVariant(variant)),
    unsetValidationError: fieldName => dispatch(Actions.ValidationErrors.unset(fieldName, FORM_NAME))
  };
};

const EditExperiment = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditExperimentPage);

export default EditExperiment;