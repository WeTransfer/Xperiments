import React from 'react';
import Store from 'store/index.es6';
import Actions from 'action/index.es6';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Link} from 'react-router';

import VisibleApplicationsMenu from 'containers/visibleapplicationsmenu.es6';

import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';

const styling = {
  paper: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 0
  }
};

export default class Layout extends React.Component {
  static propTypes = {
    notifications: React.PropTypes.object,
    resetNotification: React.PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedApp: 1,
      selectedTab: 'experiments'
    };
  }

  componentDidMount() {
    Store.dispatch(Actions.Applications.list());
  }

  selectApp = (event, index, selectedApp) => this.setState({selectedApp});

  selectTab = (event, index, selectedTab) => this.setState({selectedTab});

  render() {
    const {applications} = Store.getState();

    if (applications.isFetching) return null;

    let notification = null;
    if (this.props.notification) {
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
            dialogChildren.push(<ul>{subEl.map(subSubEl => {return <li>{subSubEl}</li>;})}</ul>);
          }
        })
      });

      notification = <MuiThemeProvider>
        <Dialog
          actions={actions}
          modal={false}
          open={true}
          {...dialogOptions}
        >
          {dialogChildren}
        </Dialog>
      </MuiThemeProvider>;
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
            <div className="col-md-4">
              <VisibleApplicationsMenu />
            </div>
            <div className="col-md-4">
            </div>
          </div>
        </Paper>
      </MuiThemeProvider>
      {children}
      {notification}
    </div>;
  }
}