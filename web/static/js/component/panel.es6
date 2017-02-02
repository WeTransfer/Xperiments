import React from 'react';

import Drawer from 'material-ui/Drawer';

export default class Panel extends React.Component {
  static propTypes = {
    children: React.PropTypes.object,
    open: React.PropTypes.bool,
    docked: React.PropTypes.bool
  }

  defaultProps = {
    width: 600,
    docked: false,
    openSecondary: true
  }

  render() {
    return <Drawer {...this.props}>
      {this.props.children}
    </Drawer>;
  }
}