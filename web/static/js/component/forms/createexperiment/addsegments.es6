import React from 'react';

import AutoComplete from 'material-ui/AutoComplete';

const dataSource = {
  languages: [{text: 'English - US', value: 'en-us'}, {text: 'Dutch', value: 'nl'}],
  countries: [{text: 'United States of America', value: "usa"}, {text: 'Netherlands', value: "nl"}]
};

export default class AddSegments extends React.Component {
  render() {
    return <div className="form__add-segments">
      <div className="row">
        <div className="col-md-6">
          <AutoComplete
            floatingLabelText="Country"
            filter={AutoComplete.noFilter}
            dataSource={dataSource.countries}
            openOnFocus={true}
          />
        </div>
        <div className="col-md-6">
          <AutoComplete
            floatingLabelText="Language"
            filter={AutoComplete.noFilter}
            dataSource={dataSource.languages}
            openOnFocus={true}
          />
        </div>
      </div>
    </div>;
  }
}