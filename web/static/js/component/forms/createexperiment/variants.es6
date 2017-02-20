import React from 'react';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

import AddVariantForm from 'containers/addvariantform.es6';

const styling = {
  emptyTD: {
    textAlign: 'center'
  }
};

export default class Variants extends React.Component {
  static propTypes = {
    selectedApplication: React.PropTypes.object,
    title: React.PropTypes.string,
    list: React.PropTypes.array,
    experimentId: React.PropTypes.string,
    delete: React.PropTypes.func
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

   getActions(variant) {
    let actions = [];

    if (variant.id) {
      actions.push(<a target="_blank" href={`${this.props.selectedApplication.url}/?experiment_id=${this.props.experimentId}&variant_id=${variant.id}`}>Preview</a>);
      actions.push(" | ");
    }

    actions.push(<a href="#" onClick={e => this.props.delete(variant)}>Delete</a>);
    return actions;
  }

  render() {
    let renderedList = [];

    this.props.list.forEach(variant => {
      renderedList.push(<TableRow>
        <TableRowColumn>{variant.name}</TableRowColumn>
        <TableRowColumn>{variant.allocation}%</TableRowColumn>
        <TableRowColumn>{variant.control_group ? 'Yes' : 'No'}</TableRowColumn>
        <TableRowColumn>{this.getActions(variant)}</TableRowColumn>
      </TableRow>);
    });

    if (!renderedList.length) {
      renderedList.push(<TableRow>
        <TableRowColumn style={styling.emptyTD} colSpan={5}>No data</TableRowColumn>
      </TableRow>);
    }

    return <div className="variants__manager">
      <div className="row">
        <div className="col-md-6"><h5>{this.props.title}</h5></div>
        <div className="col-md-6">
          <RaisedButton label="add variant" secondary={true} onTouchTap={this.showCreateVariant} className="pull-right" />
          <AddVariantForm open={this.state.isCreateVariantVisible} onCancel={this.hideCreateVariant} onAdd={this.hideCreateVariant} />
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