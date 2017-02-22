import React from 'react';

export default class Form extends React.Component {
  getError(key) {
    try {
      return this.props.validationErrors[key][0];
    } catch(e) {}
    return null;
  }

  unsetError(fieldName) {
    if (this.props.unsetValidationError)
      this.props.unsetValidationError(fieldName);
  }
}