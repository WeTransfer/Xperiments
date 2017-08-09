import { connect } from 'react-redux';
import Actions from 'action';
import UsersTable from 'component/userstable';

const getVisibleUsers = (users, filter = 'all') => {
  switch (filter) {
    case 'all':
      return users;
    default:
      return users.filter(t => t.state === filter);
  }
};

const mapStateToProps = (state) => {
  return {
    list: getVisibleUsers(state.users.list, state.users.filter),
    isFetching: state.users.isFetching,
    isDeleting: state.users.isDeleting,
    isUpdatingState: state.users.isUpdatingState,
    currentFilter: state.users.filter
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    filter: state => dispatch(Actions.Users.filter(state))
  };
};

const VisibleUsersList = connect(
  mapStateToProps,
  mapDispatchToProps
)(UsersTable);

export default VisibleUsersList;
