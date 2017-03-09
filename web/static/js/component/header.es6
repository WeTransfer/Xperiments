import React from 'react';
import {Link} from 'react-router';

import VisibleApplicationsMenu from 'containers/visibleapplicationsmenu';

import Paper from 'material-ui/Paper';

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

export default class Header extends React.Component {
  static propTypes = {
    user: React.PropTypes.object
  };

  render() {
    return <Paper style={styling.paper} zDepth={1} rounded={false}>
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
    </Paper>;
  }
}