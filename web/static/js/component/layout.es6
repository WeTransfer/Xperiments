import React from 'react';
import Store from 'store/index.es6';
import Actions from 'action/index.es6';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Link} from 'react-router';

import VisibleApplicationsMenu from 'containers/visibleapplicationsmenu.es6';

import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';

export default class Layout extends React.Component {
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
    let children = null;
    if (this.props.children !== null)
      children = <MuiThemeProvider>{this.props.children}</MuiThemeProvider>;

    return <div>
      <MuiThemeProvider>
        <Toolbar>
          <ToolbarGroup firstChild={true}>
            <VisibleApplicationsMenu />
          </ToolbarGroup>
        </Toolbar>
      </MuiThemeProvider>
      {children}
    </div>;
  }
}