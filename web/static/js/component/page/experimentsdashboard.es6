import React from 'react';
import {Link} from 'react-router';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  button: {
    margin: 12,
  }
};

export default class ExperimentsDashboardPage extends React.Component {
  render() {
    return <div className="page__expriments-dashboard">
      <Link to="/experiments/create"><RaisedButton label="create experiment" primary={true} style={styles.button} /></Link>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn>ID</TableHeaderColumn>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Variants</TableHeaderColumn>
            <TableHeaderColumn>Status</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableRowColumn>1</TableRowColumn>
            <TableRowColumn>Experiment 1</TableRowColumn>
            <TableRowColumn>2</TableRowColumn>
            <TableRowColumn>Active</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>2</TableRowColumn>
            <TableRowColumn>Experiment 2</TableRowColumn>
            <TableRowColumn>3</TableRowColumn>
            <TableRowColumn>Inactive</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>3</TableRowColumn>
            <TableRowColumn>Experiment 3</TableRowColumn>
            <TableRowColumn>3</TableRowColumn>
            <TableRowColumn>Draft</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>4</TableRowColumn>
            <TableRowColumn>Experiment 4</TableRowColumn>
            <TableRowColumn>2</TableRowColumn>
            <TableRowColumn>Finished</TableRowColumn>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  }
}
