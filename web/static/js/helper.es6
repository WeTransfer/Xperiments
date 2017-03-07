import Moment from 'react-moment';
import jstz from 'jstz';

const timezone = jstz.determine();

export default {
  formatDateTime(dateTime) {
    return <Moment format="Do MMM YYYY HH:MM" tz={timezone.name()}>{dateTime}</Moment>;
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