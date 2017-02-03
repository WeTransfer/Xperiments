import React from 'react';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import LinearProgress from 'material-ui/LinearProgress';

export default class ExperimentsTable extends React.Component {
  static propTypes = {
    experiments: React.PropTypes.arrayOf(React.PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      variants: PropTypes.array.isRequired,
      isActive: PropTypes.bool.isRequired
    }).isRequired).isRequired
  };
  
  render() {
    if (this.props.experiments.isFetching) return  <LinearProgress mode="indeterminate" />;
    
    let renderedExperiments = [];
    this.props.experiments.list.forEach((experiment) => {
      renderedExperiments.push(React.createElement(TableRow, {key: `experiment__table-row-${experiment.id}`}, [
        React.createElement(TableRowColumn, {key: `experiment__table-row-column-id-${experiment.id}`}, experiment.id),
        React.createElement(TableRowColumn, {key: `experiment__table-row-column-name-${experiment.id}`}, experiment.name),
        React.createElement(TableRowColumn, {key: `experiment__table-row-column-variants-${experiment.id}`}, experiment.variants.length),
        React.createElement(TableRowColumn, {key: `experiment__table-row-column-active-${experiment.id}`}, experiment.isActive ? 'Yes' : 'No')
      ]));
    });

    return <Table>
      <TableHeader>
        <TableRow>
          <TableHeaderColumn>ID</TableHeaderColumn>
          <TableHeaderColumn>Name</TableHeaderColumn>
          <TableHeaderColumn>Variants</TableHeaderColumn>
          <TableHeaderColumn>Status</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody>{renderedExperiments}</TableBody>
    </Table>;
  }
}
