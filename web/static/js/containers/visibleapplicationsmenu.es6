import { connect } from 'react-redux';
import Actions from 'action/index.es6';
import ApplicationsMenu from 'component/applicationsmenu.es6';

const mapStateToProps = (state) => {
  return {
    applications: state.applications,
    selectedApplication: state.user.selectedApplication
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectApplication: (applicationId) => {
      dispatch(Actions.User.setApplication(applicationId));
    }
  }
}

const VisibleApplicationsMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationsMenu)

export default VisibleApplicationsMenu