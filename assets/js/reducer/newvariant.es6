import {actions} from 'action/newvariant';
import initialVariantState from 'store/helper/newvariant';

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