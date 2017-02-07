import React from 'react';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

import AddVariant from './addvariant.es6';

export default class Variants extends React.Component {
  static propTypes = {
    title: React.propTypes.string,
    list: React.propTypes.array
  }

  defaultProps = {
    list: []
  }

  state = {
    isCreateVariantVisible: false
  }

  showCreateVariant = () => {
    this.setState({
      isCreateVariantVisible: true
    });
  }

  hideCreateVariant = () => {
    this.setState({
      isCreateVariantVisible: false
    });
  }

  render() {
    let renderedList = [];

    this.props.list.forEach(variant => {
      renderedList.push(<TableRow>
        <TableRowColumn>{variant.name}</TableRowColumn>
        <TableRowColumn>{variant.allocation}</TableRowColumn>
        <TableRowColumn>{variant.is_control_group ? 'Yes' : 'No'}</TableRowColumn>
        <TableRowColumn>-</TableRowColumn>
      </TableRow>);
    });

    return <div className="variants__manager">
      <div className="row">
        <div className="col-md-6"><h5>{this.props.title}</h5></div>
        <div className="col-md-6">
          <RaisedButton label="add variant" secondary={true} onTouchTap={this.showCreateVariant} className="pull-right"   />
          <AddVariant open={this.state.isCreateVariantVisible} onCancel={this.hideCreateVariant} onAdd={() => {}} allowControlGroupSelection={true} />
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <Table>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>Name</TableHeaderColumn>
                <TableHeaderColumn>Allocation</TableHeaderColumn>
                <TableHeaderColumn>Control Group</TableHeaderColumn>
                <TableHeaderColumn>Actions</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>{renderedList}</TableBody>
          </Table>
        </div>
      </div>
    </div>;
  }
}