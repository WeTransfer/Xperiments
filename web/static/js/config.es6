// import Store from 'store/index.es6';

// const {user, applications} = Store.getState();

// let currentAppName = applications.find((app) => {
//   return app.id = user.selectedApplication;
// });

let currentAppName = 'web';
const BASE_PATH = `/api/v1`;

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
  }
};