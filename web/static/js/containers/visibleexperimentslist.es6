import { connect } from 'react-redux';
import Actions from 'action/index.es6';
import ExperimentsTable from 'component/experimentstable.es6';

const getVisibleExperiments = (experiments, filter = 'all') => {
  switch (filter) {
    case 'all':
      return experiments;
    default:
      return experiments.filter(t => t.state === filter);
  }
}

const mapStateToProps = (state) => {
  return {
    list: getVisibleExperiments(state.experiments.list, state.experiments.filter),
    isFetching: state.experiments.isFetching,
    isDeleting: state.experiments.isDeleting,
    isUpdatingState: state.experiments.isUpdatingState,
    currentFilter: state.experiments.filter
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    start: experimentId => dispatch(Actions.Experiments.startExperiment(experimentId)),
    stop: experimentId => dispatch(Actions.Experiments.stopExperiment(experimentId)),
    terminate: experimentId => dispatch(Actions.Experiments.terminateExperiment(experimentId)),
    delete: experimentId => dispatch(Actions.Experiments.deleteExperiment(experimentId)),
    filter: state => dispatch(Actions.Experiments.filter(state))
  }
}

const VisibleExperimentsList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ExperimentsTable)

export default VisibleExperimentsList