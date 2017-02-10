import { connect } from 'react-redux';
import Actions from 'action/index.es6';
import ExperimentsTable from 'component/experimentstable.es6';

const getVisibleExperiments = (experiments, filter = 'SHOW_ALL') => {
  switch (filter) {
    case 'SHOW_ALL':
      return experiments;
    case 'SHOW_ACTIVE':
      return experiments.filter(t => !t.isActive);
  }
}

const mapStateToProps = (state) => {
  return {
    experiments: getVisibleExperiments(state.experiments, state.visibilityFilter)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    start: experimentId => dispatch(Actions.Experiments.startExperiment(experimentId)),
    stop: experimentId => dispatch(Actions.Experiments.stopExperiment(experimentId)),
    terminate: experimentId => dispatch(Actions.Experiments.terminateExperiment(experimentId))
  }
}

const VisibleExperimentsList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ExperimentsTable)

export default VisibleExperimentsList