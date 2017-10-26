import React from 'react';
import Store from 'store';

import {Link} from 'react-router';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import globalStyling from 'globalstyling';
import * as CONSTANTS from 'appconstants';

const styling = {
  ...globalStyling
};

const filters = [
  {label: 'All', value: 'all'}
];

export default class UsersTable extends React.Component {
  static propTypes = {
    list: React.PropTypes.object.isRequired,
    isUpdatingState: React.PropTypes.bool.isRequired,
    isFetching: React.PropTypes.bool.isRequired,
    isDeleting: React.PropTypes.bool.isRequired,
    currentFilter: React.PropTypes.string.isRequired,
    title: React.PropTypes.string,
    filter: React.PropTypes.func
  };

  getActions(user) {
    const {user: currentUser} = Store.getState();

    let actions = [];

    // Edit
    if (currentUser.role === CONSTANTS.USER_ADMIN) {
      actions.push(<Link to={`/users/${user.id}/edit`} disabled={true}>Edit</Link>);
    }

    return actions;
  }

  renderList() {
    let renderedUsers = [];

    if (!this.props.isFetching) {
      this.props.list.forEach(user => renderedUsers.push(this.makeRow(user)));
    }

    // Empty
    if (!renderedUsers.length) {
      renderedUsers.push(<TableRow>
        <TableRowColumn style={styling.emptyTD} colSpan={5}>{this.props.isFetching ? 'Getting your data, hang on...' : 'No users'}</TableRowColumn>
      </TableRow>);
    }

    return renderedUsers;
  }

  makeRow(user) {
    return <TableRow key={`user__table-row-${user.id}`}>
      <TableRowColumn key={`user__table-row-column-name-${user.id}`}>{user.name}</TableRowColumn>
      <TableRowColumn key={`user__table-row-column-email-${user.id}`}><a href={`mailto:${user.email}`}>{user.email}</a></TableRowColumn>
      <TableRowColumn key={`user__table-row-column-role-${user.role}`}>{user.role}</TableRowColumn>
      <TableRowColumn key={`user__table-row-column-actions-${user.id}`}>{this.getActions(user)}</TableRowColumn>
    </TableRow>;
  }

  renderFilter() {
    let filterItems = [];
    filters.forEach(filter => {
      filterItems.push(<MenuItem value={filter.value} primaryText={filter.label} />);
    });

    return <SelectField
      floatingLabelText="Filter by"
      value={this.props.currentFilter}
      onChange={(e, index, value) => this.props.filter(value)}
    >
      {filterItems}
    </SelectField>;
  }

  render() {
    return <div className="users__table">
      <div className="row">
        <div className="col-xs-6"><h4>{this.props.title}</h4></div>
        <div className="col-xs-6">
          <div className="pull-right">{this.renderFilter()}</div>
        </div>
      </div>
      <Table>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Email</TableHeaderColumn>
            <TableHeaderColumn>Role</TableHeaderColumn>
            <TableHeaderColumn></TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>{this.renderList()}</TableBody>
      </Table>
    </div>;
  }
}
