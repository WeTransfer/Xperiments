export default {
  formatDateTime(dateTime) {
    return `${new Date(dateTime).toDateString()} ${new Date(dateTime).toLocaleTimeString()}`;
  },

  async makeErrorMessage(response) {
    if (response.status === 422) {
      let message = [];
      await response.json().then(json => {
        Object.keys(json.errors).forEach(key => {
          let subMessage = [key];
          subMessage.push(json.errors[key]);
          message.push(subMessage);
        });
      });
      return message;
    }
  }
};