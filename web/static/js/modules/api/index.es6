import fetch from 'whatwg-fetch';

const DEFAULT_OPTIONS = {
  credentials: 'include'
};

export default {
  get: (...args) => {
    return window.fetch(args, {
      credentials: 'include'
    });
  },

  post: (url, data) => {
    return window.fetch(new Request(url, {
      method: 'POST', 
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(data),
      ...DEFAULT_OPTIONS
    }));
  },

  put: (url, data) => {
    return window.fetch(new Request(url, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(data),
      ...DEFAULT_OPTIONS
    }));
  },

  delete: (url, data) => {
    return window.fetch(new Request(url, {
      method: 'DELETE',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      ...DEFAULT_OPTIONS
    }));
  }
};