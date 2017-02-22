import Store from 'store/index.es6';
import { connect } from 'react-redux';
import Actions from 'action/index.es6';
import AddExperiment from 'component/forms/createexperiment/addexperiment.es6';

const FORM_NAME = 'createExperimentForm';

const setValue = (key, value, dispatch) => {
  let data = {};
  data[key] = value;
  dispatch(Actions.NewExperiment.setValues(data));
}

const mapStateToProps = (state) => {
  return {
    experiment: state.newexperiment,
    validationErrors: state.validationerrors[FORM_NAME]
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setName: value => {setValue('name', value, dispatch)},
    setStartDate: value => {setValue('start_date', value, dispatch)},
    setStartTime: value => {setValue('start_date', value, dispatch)},
    setEndDate: value => {setValue('end_date', value, dispatch)},
    setEndTime: value => {setValue('end_date', value, dispatch)},
    setDescription: value => {setValue('description', value, dispatch)},
    setSamplingRate: value => {setValue('sampling_rate', value, dispatch)},
    setMaxUsers: value => {setValue('max_users', value, dispatch)},
    save: (data, formName) => {
      let promise = dispatch(Actions.NewExperiment.create(data, formName));
      promise.then(() => {
        ownProps.onSave();
      });
    },
    cancel: () => {
      dispatch(Actions.ValidationErrors.reset(FORM_NAME));
      ownProps.onClose();
    },
    unsetValidationError: fieldName => {
      dispatch(Actions.ValidationErrors.unset(fieldName, FORM_NAME));
    }
  }
}

const CreateExperiment = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddExperiment);

export default CreateExperiment;