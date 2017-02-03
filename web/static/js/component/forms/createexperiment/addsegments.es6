import React from 'react';

import AutoComplete from 'material-ui/AutoComplete';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const dataSource = {
  languages: [{text: 'English - US', value: 'en-us'}, {text: 'Dutch', value: 'nl'}],
  countries: [{text: 'United States of America', value: "usa"}, {text: 'Netherlands', value: "nl"}]
};

export default class AddSegments extends React.Component {
  state = {
    segments: [
      {parameter: "", type: "", operator: "", value: ""}
    ]
  }

  render() {
    return <div className="form__add-segments">
      <div className="row">
        <div className="col-md-3">
          <SelectField floatingLabelText="Segment" value={null}>
            <MenuItem value={null} primaryText="" />
            <MenuItem value="language" primaryText="Language" />
            <MenuItem value="country" primaryText="Country" />
          </SelectField>
        </div>
        <div className="col-md-3">
          <SelectField floatingLabelText="Value Type" value="string" disabled={true}>
            <MenuItem value="string" primaryText="String" />
          </SelectField>
        </div>
        <div className="col-md-3">
          <SelectField floatingLabelText="Operator" value="==">
            <MenuItem value="==" primaryText="Equals" />
            <MenuItem value=">" primaryText="Is greater than" />
            <MenuItem value="<" primaryText="Is less than" />
            <MenuItem value="!=" primaryText="Is not equal to" />
          </SelectField>
        </div>
        <div className="col-md-3">
          <AutoComplete
            floatingLabelText="Country"
            filter={AutoComplete.noFilter}
            dataSource={dataSource.countries}
            openOnFocus={true}
          />
        </div>
      </div>
    </div>;
  }
}

// <div className="col-md-4">
//   <AutoComplete
//     floatingLabelText="Language"
//     filter={AutoComplete.noFilter}
//     dataSource={dataSource.languages}
//     openOnFocus={true}
//   />
// </div>