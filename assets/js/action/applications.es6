import ActionHelper from 'modules/redux-actions';
import {actions as UserActions} from 'action/user';
import API from 'modules/api/index';

import config from 'config';

export const actions = ActionHelper.types([
  'FETCH_APPLICATIONS',
  'FETCHED_APPLICATIONS'
]);

export default ActionHelper.generate({
  list() {
    return async dispatch => {
      dispatch({type: actions.FETCH_APPLICATIONS});

      API.get(config.api.resources.applications.GET)
        .then(response => {
          response.json().then(json => {
            let selectedApplication = null;
            
            if (json.applications.length)
              selectedApplication = json.applications[0].id;

            dispatch({
              type: UserActions.SET_APPLICATION,
              applicationId: selectedApplication
            });

            dispatch({
              type: actions.FETCHED_APPLICATIONS,
              list: json.applications
            });
          });
        });
    };
  }
});
