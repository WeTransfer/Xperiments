import React from 'react';

import Form from 'component/form';

import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';

import Helper from 'helper';

export default class UserForm extends Form {
  static propTypes = {
    user: React.PropTypes.object,
    setName: React.PropTypes.func,
    validationErrors: React.PropTypes.object,
    unsetValidationError: React.PropTypes.func
  };

  render() {
    return <div className="form__create-user">
      <div className="row">
        <div className="col-md-12">
          <TextField
            fullWidth={true}
            defaultValue={this.props.user.name || ''}
            floatingLabelText="Name"
            onChange={(e, value) => {
              this.props.setName(value);
              this.unsetError('name');
            }}
            errorText={this.getError('name')}
          />
        </div>
      </div>
    </div>;
  }
}
