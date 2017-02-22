import React from 'react';

import VariantPayloadOptions from 'variantpayloadoptions.es6';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

import VariantFormContainer from 'containers/variantform.es6';

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
    isCreateVariantVisible: false,
    editableVariant: {}
  }

  showVariantForm = (variant = {}) => {
    this.setState({
      isCreateVariantVisible: true,
      editableVariant: variant
    });
  }

  showEditVariant = (variant) => {
    this.showVariantForm(variant);
  }

  showCreateVariant = () => {
    this.showVariantForm();
  }

  hideVariantForm = () => {
    this.setState({
      isCreateVariantVisible: false,
      editableVariant: {}
    });
  }

  getActions(variant) {
    let actions = [];

    if (variant.id) {
      actions.push(<a target="_blank" href={`${this.props.selectedApplication.url}/?experiment_id=${this.props.experimentId}&variant_id=${variant.id}`}>Preview</a>);
      actions.push(" | ");
    }

    actions.push(<a onClick={e => this.showEditVariant(variant)}>Edit</a>);
    actions.push(" | ");

    actions.push(<a onClick={e => this.props.delete(variant)}>Delete</a>);
    return actions;
  }

  makeRow(variant) {
    let payloadKey = JSON.parse(variant.payload);
    let type = VariantPayloadOptions.web[VariantPayloadOptions.web.findIndex(el => el.key === Object.keys(payloadKey)[0])].name;

    return <TableRow>
      <TableRowColumn>{variant.name}</TableRowColumn>
      <TableRowColumn>{variant.allocation}%</TableRowColumn>
      <TableRowColumn>{variant.control_group ? 'Yes' : 'No'}</TableRowColumn>
      <TableRowColumn>{type}</TableRowColumn>
      <TableRowColumn>{this.getActions(variant)}</TableRowColumn>
    </TableRow>;
  }

  render() {
    let renderedList = [];

    this.props.list.forEach(variant => {
      renderedList.push(this.makeRow(variant));
    });

    if (!renderedList.length) {
      renderedList.push(<TableRow>
        <TableRowColumn style={styling.emptyTD} colSpan={5}>No variants</TableRowColumn>
      </TableRow>);
    }

    return <div className="variants__manager">
      <div className="row">
        <div className="col-md-6"><h4>{this.props.title}</h4></div>
        <div className="col-md-6">
          <RaisedButton label="add variant" secondary={true} onTouchTap={this.showCreateVariant} className="pull-right" />
          <VariantFormContainer
            open={this.state.isCreateVariantVisible}
            onCancel={this.hideVariantForm}
            onAdd={this.hideVariantForm}
            variant={this.state.editableVariant}
          />
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
                <TableHeaderColumn>Type</TableHeaderColumn>
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