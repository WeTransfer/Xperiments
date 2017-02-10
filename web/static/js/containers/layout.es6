import { connect } from 'react-redux';
import LayoutComponent from 'component/layout.es6';
import Actions from 'action/index.es6';

const mapStateToProps = (state) => {
  return {
    notification: state.app.notificationData
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    resetNotification: () => dispatch(Actions.App.resetNotification())
  };
}

const Layout = connect(
  mapStateToProps,
  mapDispatchToProps
)(LayoutComponent)

export default Layout;