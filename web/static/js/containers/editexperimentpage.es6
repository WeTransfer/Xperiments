import Store from 'store/index.es6';
import {connect} from 'react-redux';
import Actions from 'action/index.es6';
import EditExperimentPage from 'component/page/editexperiment.es6';

const mapStateToProps = (state) => {
  return {
    selectedApplication: {url: 'http://lvh.me:4000'},
    experiment: state.experiment,
    indexedExperimentsList: state.experiments.indexedList
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    save: (data) => {
      dispatch(Actions.Experiment.update(data));
    }
  }
}

const EditExperiment = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditExperimentPage);

export default EditExperiment;