import { connect } from 'react-redux';
import Actions from 'action';
import ApplicationsMenu from 'component/applicationsmenu';

const mapStateToProps = (state) => {
  return {
    applications: state.applications,
    selectedApplication: state.user.selectedApplication
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    selectApplication: (applicationId) => {
      dispatch(Actions.User.setApplication(applicationId));
    }
  };
};

const VisibleApplicationsMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationsMenu);

export default VisibleApplicationsMenu;