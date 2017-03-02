import React from 'react';
import Store from 'store/index.es6';
import Actions from 'action/index.es6';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Link} from 'react-router';

import config from 'config.es6';
import VisibleApplicationsMenu from 'containers/visibleapplicationsmenu.es6';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';

const styling = {
  h3: {
    fontWeight: 300
  },
  paper: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 0
  },
  userBlock: {
    main: {
      padding: '10px 0px'
    },
    avatar: {
      display: 'inline-block',
      verticalAlign: 'top',
      width: '40px',
      height: '40px',
      border: 'solid 0px',
      borderRadius: '20px',
      overflow: 'hidden'
    },
    avatarImage: {
      width: '100%'
    },
    info: {
      display: 'inline-block',
      marginLeft: '10px'
    },
    infoEmail: {
      fontSize: '12px',
      color: '#868686'
    },
    infoLinks: {
      fontSize: '12px'
    }
  }
};

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
    console.log(this.props.notification);
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
        <Paper style={styling.paper} zDepth={1} rounded={false}>
          <div className="row">
            <div className="col-xs-12 col-md-2">
              <Link to="/"><h3 style={styling.h3}>Xperiments</h3></Link>
            </div>
            <div className="col-xs-4 col-md-3">
              <VisibleApplicationsMenu />
            </div>
            <div className="col-xs-8 col-md-7">
              <div className="pull-right">
                <div className="user__block" style={styling.userBlock.main}>
                  <div className="user__block-avatar" style={styling.userBlock.avatar}>
                    <img src={this.props.user.avatar} style={styling.userBlock.avatarImage} />
                  </div>
                  <div className="user__block-info" style={styling.userBlock.info}>
                    <div className="user__block-name">{this.props.user.name}</div>
                    <div className="user__block-email" style={styling.userBlock.infoEmail}>{this.props.user.email}</div>
                    <div className="user__block-links" style={styling.userBlock.infoLinks}>
                      <a href="/auth/logout">Logout</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Paper>
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