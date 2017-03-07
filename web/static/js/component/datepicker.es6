import React from 'react';

import TextField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const DAYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const YEARS = [2017, 2018, 2019, 2020, 2021];

export default class DatePicker extends React.Component {
  static propTypes = {
    date: React.PropTypes.object
  };

  render() {
    return <div className="datepicker">
      <SelectField>
        <MenuItem value={option.value} primaryText={option.label} />
      </SelectField>
      <SelectField>
        <MenuItem value={option.value} primaryText={option.label} />
      </SelectField>
      <SelectField>
        <MenuItem value={option.value} primaryText={option.label} />
      </SelectField>
    </div>;
  }
}