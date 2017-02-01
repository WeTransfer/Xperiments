import React from 'react';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

import AddVariant from './addvariant.es6';

export default class Variants extends React.Component {
  static propTypes = {
    title: React.propTypes.string  
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
    return <div className="variants__manager">
      <div className="row">
        <div className="col-md-6"><h5>{this.props.title}</h5></div>
        <div className="col-md-6">
          <RaisedButton label="add variant" secondary={true} onTouchTap={this.showCreateVariant} className="pull-right"   />
          <AddVariant open={this.state.isCreateVariantVisible} onCancel={this.hideCreateVariant} onAdd={() => {}} />
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
            <TableBody displayRowCheckbox={false}>
              <TableRow>
                <TableRowColumn>Original Variant</TableRowColumn>
                <TableRowColumn>50%</TableRowColumn>
                <TableRowColumn>Yes</TableRowColumn>
                <TableRowColumn></TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>VariantA</TableRowColumn>
                <TableRowColumn>25%</TableRowColumn>
                <TableRowColumn>No</TableRowColumn>
                <TableRowColumn></TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>VariantB</TableRowColumn>
                <TableRowColumn>25%</TableRowColumn>
                <TableRowColumn>No</TableRowColumn>
                <TableRowColumn></TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>;
  }
}