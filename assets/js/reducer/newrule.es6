import {actions} from 'action/newrule';
import initialRuleState from 'store/helper/newrule';

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