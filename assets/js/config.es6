let currentAppName = 'web';
const BASE_PATH = '/api/v1';
const REPORTING_URL = window['__REPORTING_URL__'] || '';

export default {
  api: {
    resources: {
      auth: {
        POST: `${BASE_PATH}/sessions`
      },
      applications: {
        GET: `${BASE_PATH}/applications`
      },
      experiments: {
        GET: `${BASE_PATH}/applications/${currentAppName}/experiments`,
        POST: `${BASE_PATH}/applications/${currentAppName}/experiments`
      },
      users: {
        GET: `${BASE_PATH}/users`,
        POST: `${BASE_PATH}/users`
      }
    }
  },
  reports: {
    url: REPORTING_URL
  },
  notification: {
    info: {
      autohide: 5000
    }
  }
};
