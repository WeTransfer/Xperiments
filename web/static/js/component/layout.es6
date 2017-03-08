import React from 'react';
import Store from 'store/index.es6';
import Actions from 'action/index.es6';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Header from 'component/header.es6';

import config from 'config.es6';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';

export default class Layout extends React.Component {
  static propTypes = {
    applications: React.PropTypes.object,
    notifications: React.PropTypes.object,
    resetNotification: React.PropTypes.func,
    notification: React.PropTypes.object,
    children: React.PropTypes.object,
    user: React.PropTypes.object
  };

  componentWillMount() {
    Store.dispatch(Actions.Applications.list());
  }

  getErrorNotification() {
    let actions = [
      <FlatButton
        label="Okay"
        primary={true}
        onTouchTap={this.props.resetNotification}
      />
    ];

    let dialogOptions = {};
    if (this.props.notification.title)
      dialogOptions.title = this.props.notification.title;
    
    let dialogChildren = [];
    this.props.notification.message.forEach(el => {
      el.forEach(subEl => {
        if (typeof subEl === 'string') {
          dialogChildren.push(<h4>{el[0]}</h4>);
        } else if (typeof subEl === 'object') {
          dialogChildren.push(<ul>{subEl.map(subSubEl => {
            return <li>{subSubEl}</li>;
          })}</ul>);
        }
      });
    });

    return <Dialog
      actions={actions}
      modal={false}
      open={true}
      {...dialogOptions}
    >
      {dialogChildren}
    </Dialog>;
  }

  render() {
    if (this.props.applications.isFetching) return null;

    let notification = null;
    let snackbar = {
      show: false,
      message: ''
    };
    if (this.props.notification) {
      if (this.props.notification.type === 'error') {
        notification = <MuiThemeProvider>{this.getErrorNotification()}</MuiThemeProvider>;
      } else if (this.props.notification.type === 'info') {
        snackbar.show = true;
        snackbar.message = this.props.notification.message;
        snackbar.onClose = () => Store.dispatch(Actions.App.resetNotification());
      }
    }

    let children = null;
    if (this.props.children !== null) {
      children = <MuiThemeProvider>
        {this.props.children}
      </MuiThemeProvider>;
    }

    return <div>
      <MuiThemeProvider>
        <Header user={this.props.user} />
      </MuiThemeProvider>
      {children}
      {notification}
      <MuiThemeProvider>
        <Snackbar
          open={snackbar.show}
          message={snackbar.message}
          autoHideDuration={config.notification.info.autohide}
          onRequestClose={snackbar.onClose}
        />
      </MuiThemeProvider>
    </div>;
  }
}