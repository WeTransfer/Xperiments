export default {
  formatDateTime(dateTime) {
    return `${new Date(dateTime).toDateString()} ${new Date(dateTime).toLocaleTimeString()}`;
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