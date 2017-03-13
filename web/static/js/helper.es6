import React from 'react';
import Moment from 'react-moment';
import jstz from 'jstz';

const timezone = jstz.determine();

export default {
  formatDateTime(dateTime, utc = true) {
    let options = {};
    
    if (utc) {
      options.utc = true;
    } else {
      options.tz = timezone.name();
    }
    
    return <Moment format="Do MMM YYYY HH:mm" {...options}>{dateTime}</Moment>;
  },

  getCurrentTime() {
    return <Moment format="HH:mm" tz={timezone.name()}>{new Date()}</Moment>;
  },

  makeErrorMessage(json) {
    let message = [];
    Object.keys(json.errors).forEach(key => {
      let subMessage = [key];
      subMessage.push(json.errors[key]);
      message.push(subMessage);
    });
    return message;
  }
};