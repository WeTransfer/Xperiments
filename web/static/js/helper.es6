export default {
  formatDateTime(dateTime) {
    return `${new Date(dateTime).toDateString()} ${new Date(dateTime).toLocaleTimeString()}`;
  }
}