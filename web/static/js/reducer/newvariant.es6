import {actions} from 'action/newvariant.es6';
import initialVariantState from 'store/helper/newvariant.es6';

export default function(state = {}, action) {
  const {type} = action;

  switch (type) {
    case actions.SET_NEW_VARIANT_VALUES:
      return {
        ...state,
        ...action.data
      };

    case actions.RESET_NEW_VARIANT:
      return {
        ...initialVariantState
      };
  }

  return state;
}