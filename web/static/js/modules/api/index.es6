export default {
  get: (...args) => {
    return window.fetch(args);
  },

  post: (url, data) => {
    return window.fetch(new Request(url, {
      method: 'POST', 
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(data)
    }));
  }
};