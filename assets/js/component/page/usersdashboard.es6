import React from 'react';
import Store from 'store';
import Actions from 'action';

import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';

import CreateUserForm from 'containers/createuser';
import VisibleUsersList from 'containers/visibleuserslist';

const styling = {
  paper: {
    padding: 20,
    marginTop: 20
  },
  button: {
    marginTop: 20
  }
};

export default class UsersDashboardPage extends React.Component {
  state = {
    isCreateUserVisible: false
  };

  componentDidMount() {
    Store.dispatch(Actions.Users.list());
  }

  showCreateUser = () => {
    this.setState({
      isCreateUserVisible: true
    });
  }

  hideCreateUser = () => {
    this.setState({
      isCreateUserVisible: false
    });
  }

  render() {
    return <div className="page__users-dashboard">
      <div className="row">
        <div className="col-md-12">
          <div className="pull-right">
            <RaisedButton style={styling.button} label="create user" primary={true} onTouchTap={this.showCreateUser} />
          </div>
        </div>
        <div className="col-md-12">
          <Paper style={styling.paper} zDepth={1} rounded={false}>
            <VisibleUsersList title="Users" />
          </Paper>
        </div>
      </div>
      <CreateUserForm
        isVisible={this.state.isCreateUserVisible}
        onClose={this.hideCreateUser}
        onSave={this.hideCreateUser}
      />
    </div>;
  }
}
