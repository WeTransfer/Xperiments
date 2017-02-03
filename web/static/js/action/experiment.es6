import Store from 'store/index.es6';
import ActionHelper from 'modules/redux-actions/index.es6';
import {actions as ExperimentActions} from 'action/experiments.es6';
import API from 'modules/api/index.es6';
import config from 'config.es6';

export const actions = ActionHelper.types([
  'CREATE_EXPERIMENT',
  'SET_EXPERIMENT_VALUES',
  'RESET_EXPERIMENT'
]);

export default ActionHelper.generate({
  create(data) {
    return async (dispatch, getState) => {
      API.post(config.api.resources.experiments.POST, {experiment: data})
        .then(response => {
          response.json(json => {
            dispatch({
              type: actions.CREATE_EXPERIMENT,
              data: json.experiment
            });

            dispatch({
              type: ExperimentActions.PUSH_TO_EXPERIMENTS,
              data: json.experiment
            });
          });

          dispatch({type: actions.RESET_EXPERIMENT});
        });
    };
  },

  setValues(data) {
    return (dispatch, getState) => {
      dispatch({
        type: actions.SET_EXPERIMENT_VALUES,
        data
      });
    };
  }
});
