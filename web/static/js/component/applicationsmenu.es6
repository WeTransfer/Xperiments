import React from 'react';
import Store from 'store/index.es6';

import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';

export default class ApplicationsMenu extends React.Component {
  static propTypes = {
    applications: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired).isRequired,
    selectedApplication: React.PropTypes.integer,
    setApplication: React.PropTypes.func
  };

  handleChange = (e, key, value) => {
    this.props.selectApplication(value);
  }
  
  render() {    
    let renderedApplications = [];
    if (!this.props.applications.isFetching) {
      this.props.applications.list.forEach((application) => {
        renderedApplications.push(React.createElement(MenuItem, {key: `applications__menu-${application.id}`, value: application.id, primaryText: application.name}));
      });
    }

    return <DropDownMenu value={this.props.selectedApplication} onChange={this.handleChange}>
      {renderedApplications}
    </DropDownMenu>;
  }
}