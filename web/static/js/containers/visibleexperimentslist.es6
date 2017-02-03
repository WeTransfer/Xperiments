import { connect } from 'react-redux';
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
  return {}
}

const VisibleExperimentsList = connect(
  mapStateToProps,
  mapDispatchToProps
)(ExperimentsTable)

export default VisibleExperimentsList