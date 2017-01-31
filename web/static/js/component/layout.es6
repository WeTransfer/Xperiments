import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Link} from 'react-router';

import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';

export default class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedApp: 1,
      selectedTab: 'experiments'
    };
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
            <DropDownMenu value={this.state.selectedApp} onChange={this.selectApp}>
              <MenuItem value={1} primaryText="Web" />
              <MenuItem value={2} primaryText="OSx App" />
              <MenuItem value={3} primaryText="iOS App" />
              <MenuItem value={4} primaryText="Android App" />
            </DropDownMenu>
          </ToolbarGroup>
        </Toolbar>
      </MuiThemeProvider>
      {children}
    </div>;
  }
}