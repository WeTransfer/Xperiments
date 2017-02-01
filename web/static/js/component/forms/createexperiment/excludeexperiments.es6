import React from 'react';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import AutoComplete from 'material-ui/AutoComplete';

const dataSource = [
  {text: 'Experiment 1', value: {id: 1, name: 'Experiment 1', startDate: '2017-02-01 00:00:00', endDate: '2017-02-20 00:00:00'}},
  {text: 'Experiment 2', value: {id: 2, name: 'Experiment 2', startDate: '2017-02-01 01:00:00', endDate: '2017-02-20 00:00:00'}},
  {text: 'Experiment 3', value: {id: 3, name: 'Experiment 3', startDate: '2017-02-01 02:00:00', endDate: '2017-02-20 00:00:00'}},
];

export default class ExlcudeExperiments extends React.Component {
  state = {
    experiments: []
  }

  renderExperiment(experiment) {
    return <TableRow>
      <TableRowColumn>{experiment.name}</TableRowColumn>
      <TableRowColumn>{experiment.startDate}</TableRowColumn>
      <TableRowColumn>{experiment.endDate}</TableRowColumn>
    </TableRow>;
  }

  handleExperimentSelection = (chosenRequest, index) => {
    let experiments = this.state.experiments;
    experiments.push(chosenRequest.value);
    this.setState({experiments}); 
  }

  render() {
    let renderedExperiments = [];

    if (this.state.experiments) {
      this.state.experiments.forEach((experiment) => {
        renderedExperiments.push(this.renderExperiment(experiment));
      })
    }

    return <div className="form__exclude-experiments">
      <div className="row">
        <div className="col-md-12">
          <AutoComplete
            floatingLabelText="Lookup by Experiment Name"
            filter={AutoComplete.noFilter}
            dataSource={dataSource}
            openOnFocus={true}
            onNewRequest={this.handleExperimentSelection}
          />
        </div>
      </div>
      <div className="spacing spacing--is-30"></div>
      <div className="row">
        <div className="col-md-12">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderColumn>Name</TableHeaderColumn>
                <TableHeaderColumn>Start Date</TableHeaderColumn>
                <TableHeaderColumn>End Date</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody>{renderedExperiments}</TableBody>
          </Table>
        </div>
      </div>
    </div>
  }
}