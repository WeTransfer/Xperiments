import React from 'react';

export default class Form extends React.Component {
  static propTypes = {
    validationErrors: React.PropTypes.object,
    unsetValidationError: React.PropTypes.func
  };

  getError(key) {
    try {
      return this.props.validationErrors[key][0];
    } catch (e) {
      // do something
    }
    return null;
  }

  unsetError(fieldName) {
    if (this.props.unsetValidationError)
      this.props.unsetValidationError(fieldName);
  }
}