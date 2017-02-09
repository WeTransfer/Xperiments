import {actions} from 'action/newrule.es6';
import initialRuleState from 'store/helper/newrule.es6';

export default function(state = {}, action) {
  const {type} = action;

  switch (type) {
    case actions.SET_NEW_RULE_VALUES:
      return {
        ...state,
        ...action.data
      };

    case actions.RESET_NEW_RULE:
      return {
        ...initialRuleState
      };
  }

  return state;
}