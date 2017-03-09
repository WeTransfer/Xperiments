import {connect} from 'react-redux';
import Actions from 'action';
import CloneExperiment from 'component/forms/createexperiment/cloneexperiment';

const FORM_NAME = 'cloneExperimentForm';

let setValuesFromProperty = true;

const setValue = (key, value, dispatch) => {
  let data = {};
  data[key] = value;
  dispatch(Actions.NewExperiment.setValues(data));
};

const mapStateToProps = (state, ownProps) => {
  if (setValuesFromProperty) {
    state.newexperiment = Object.assign(state.newexperiment, ownProps.experiment);
    state.newexperiment.id = null;
    state.newexperiment.name = `Clone of ${state.newexperiment.name}`;
    state.newexperiment.start_date = null;
    state.newexperiment.end_date = null;
    state.newexperiment.inserted_at = null;
    state.newexperiment.state = null;
    
    setValuesFromProperty = false;
  }

  return {
    experiment: state.newexperiment,
    validationErrors: state.validationerrors[FORM_NAME]
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setStartDate: value => setValue('start_date', value, dispatch),
    setStartTime: value => setValue('start_date', value, dispatch),
    setEndDate: value => setValue('end_date', value, dispatch),
    setEndTime: value => setValue('end_date', value, dispatch),
    save: (data, formName) => {
      dispatch(Actions.NewExperiment.create(data, formName));
      setValuesFromProperty = true;
    },
    cancel: () => {
      dispatch(Actions.ValidationErrors.reset(FORM_NAME));
      ownProps.onClose();
      setValuesFromProperty = true;
    },
    unsetValidationError: fieldName => {
      dispatch(Actions.ValidationErrors.unset(fieldName, FORM_NAME));
    }
  };
};

const CloneExperimentContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CloneExperiment);

export default CloneExperimentContainer;