import React from 'react';

import VariantPayloadOptions from 'variantpayloadoptions';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';

import CreateVariantFormContainer from 'containers/createvariantform';
import EditVariantFormContainer from 'containers/editvariantform';

import globalStyling from 'globalstyling';

const styling = {
  ...globalStyling
};

export default class Variants extends React.Component {
  static propTypes = {
    selectedApplication: React.PropTypes.object,
    title: React.PropTypes.string,
    list: React.PropTypes.array,
    experimentId: React.PropTypes.string,
    delete: React.PropTypes.func,
    readOnly: React.PropTypes.boolean,
    user: React.PropTypes.object
  }

  defaultProps = {
    list: []
  }

  state = {
    isCreateVariantVisible: false,
    editableVariant: null
  }

  showEditVariant = (variant) => {
    this.setState({
      editableVariant: variant
    });
  }

  hideEditVariant = () => {
    this.setState({
      editableVariant: null
    });
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

    if (variant.id && this.props.selectedApplication) {
      actions.push(<a target="_blank" href={`${this.props.selectedApplication.settings.url}/?experiment_id=${this.props.experimentId}&variant_id=${variant.id}&token=${this.props.user.token}`}>Preview</a>);
      actions.push(' | ');
    }

    actions.push(<a onClick={() => {
      this.showEditVariant(variant);
    }}>Edit</a>);
    actions.push(' | ');

    actions.push(<a onClick={() => {
      this.props.delete(variant);
    }}>Delete</a>);
    return actions;
  }

  makeRow(variant) {
    let payloadKey = JSON.parse(variant.payload);
    let type = VariantPayloadOptions.web[VariantPayloadOptions.web.findIndex(el => el.key === Object.keys(payloadKey)[0])].name;

    let actionsRow = null;
    if (!this.props.readOnly)
      actionsRow = <TableRowColumn>{this.getActions(variant)}</TableRowColumn>;

    return <TableRow>
      <TableRowColumn>{variant.name}</TableRowColumn>
      <TableRowColumn>{variant.allocation}%</TableRowColumn>
      <TableRowColumn>{variant.control_group ? 'Yes' : 'No'}</TableRowColumn>
      <TableRowColumn>{type}</TableRowColumn>
      {actionsRow}
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

    let editVariantForm = null;
    if (this.state.editableVariant) {
      editVariantForm = <EditVariantFormContainer
        open={true}
        onCancel={this.hideEditVariant}
        onAdd={this.hideEditVariant}
        variant={this.state.editableVariant}
      />;
    }

    let actionsRow = null;
    let addVariant = null;
    if (!this.props.readOnly) {
      actionsRow = <TableHeaderColumn>Actions</TableHeaderColumn>;
      addVariant = [
        <RaisedButton label="add variant" secondary={true} onTouchTap={this.showCreateVariant} className="pull-right" />,
        <CreateVariantFormContainer
          open={this.state.isCreateVariantVisible}
          onCancel={this.hideCreateVariant}
          onAdd={this.hideCreateVariant}
        />
      ];
    }

    return <div className="variants__manager">
      <div className="row">
        <div className="col-md-6"><h4>{this.props.title}</h4></div>
        <div className="col-md-6">
          {addVariant}
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
                {actionsRow}
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>{renderedList}</TableBody>
          </Table>
        </div>
      </div>
      {editVariantForm}
    </div>;
  }
}