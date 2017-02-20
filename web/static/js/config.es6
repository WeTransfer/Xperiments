// import Store from 'store/index.es6';

// const {user, applications} = Store.getState();

// let currentAppName = applications.find((app) => {
//   return app.id = user.selectedApplication;
// });

let currentAppName = 'web';
const BASE_PATH = `/api/v1/applications/${currentAppName}`;

export default {
  api: {
    resources: {
      experiments: {
        GET: `${BASE_PATH}/experiments`,
        POST: `${BASE_PATH}/experiments`
      }
    }
  }
};