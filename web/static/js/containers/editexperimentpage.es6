import Store from 'store/index.es6';
import {connect} from 'react-redux';
import Actions from 'action/index.es6';
import EditExperimentPage from 'component/page/editexperiment.es6';

const setValue = (key, value) => {
  let data = {};
  data[key] = value;
  return Actions.Experiment.setValues(data);
}

const mapStateToProps = (state) => {
  return {
    selectedApplication: {url: 'http://lvh.me:4000'},
    experiment: state.experiment,
    indexedExperimentsList: state.experiments.indexedList,
    validationErrors: state.validationerrors.editExperimentForm
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
    setSamplingRate: value => {dispatch(setValue('sampling_rate', value))},
    setMaxUsers: value => {dispatch(setValue('max_users', value))},
    save: data => dispatch(Actions.Experiment.update(data, 'editExperimentForm')),
    deleteRule: rule => dispatch(Actions.Experiment.popRule(rule)),
    deleteVariant: variant => dispatch(Actions.Experiment.popVariant(variant))
  }
}

const EditExperiment = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditExperimentPage);

export default EditExperiment;