import { connect } from 'react-redux';
import LayoutComponent from 'component/layout';
import Actions from 'action';

const mapStateToProps = (state) => {
  return {
    user: state.user,
    applications: state.applications,
    notification: state.app.notificationData
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetNotification: () => dispatch(Actions.App.resetNotification())
  };
};

const Layout = connect(
  mapStateToProps,
  mapDispatchToProps
)(LayoutComponent);

export default Layout;