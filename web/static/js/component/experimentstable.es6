import React from 'react';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

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
    let renderedExperiments = [];
    this.props.experiments.list.forEach((experiment) => {
      renderedExperiments.push(React.createElement(TableRow, {key: `experiment__table-row-${experiment.id}`}, [
        React.createElement(TableRowColumn, null, experiment.id),
        React.createElement(TableRowColumn, null, experiment.name),
        React.createElement(TableRowColumn, null, experiment.variants.length),
        React.createElement(TableRowColumn, null, experiment.isActive ? 'Yes' : 'No')
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
