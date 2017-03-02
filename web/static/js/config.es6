let currentAppName = 'web';
const BASE_PATH = '/api/v1';

export default {
  api: {
    resources: {
      applications: {
        GET: `${BASE_PATH}/applications`
      },
      experiments: {
        GET: `${BASE_PATH}/applications/${currentAppName}/experiments`,
        POST: `${BASE_PATH}/applications/${currentAppName}/experiments`
      }
    }
  },
  notification: {
    info: {
      autohide: 5000
    }
  },
  users: {
    'manpreet@wetransfer.com' : {
      rights: ['CHANGE_STATE']
    },
    'dmitry@wetransfer.com': {
      rights: ['CHANGE_STATE']
    },
    'max@wetransfer.com': {
      rights: ['CHANGE_STATE']
    },
    'sebaas@wetransfer.com': {
      rights: ['CHANGE_STATE']
    },
    'vermaat@wetransfer.com': {
      rights: ['CHANGE_STATE']
    },
    'khalil@wetransfer.com': {
      rights: ['CHANGE_STATE']
    },
    'julik@wetransfer.com': {
      rights: ['CHANGE_STATE']
    },
    'bastiaan@wetransfer.com': {
      rights: ['CHANGE_STATE']
    },
    'jochem@wetransfer.com': {
      rights: ['CHANGE_STATE']
    },
    'palma@wetransfer.com': {
      rights: []
    },
    'brian@wetransfer.com': {
      rights: []
    },
    'stefan@wetransfer.com': {
      rights: []
    }
  }
};