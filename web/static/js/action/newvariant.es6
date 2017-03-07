import ActionHelper from 'modules/redux-actions';
import {actions as ValidationErrorsActions} from 'action/validationerrors';

const validate = data => {
  let errors = {};

  // let totalAllocation = 0;
  // variants.forEach(variant => {
  //   totalAllocation += variant.allocation;
  // });

  if (!data.name)
    errors.name = ['This field is required'];
  
  if (!data.allocation)
    errors.allocation = ['This field is required'];
  else if (isNaN(data.allocation))
    errors.allocation = ['Provide a valid number'];
  // else if (totalAllocation + data.allocation > 100)
  //   errors.allocation = [`Allocation can not be greater than 100% (currently allocated: ${totalAllocation}%)`];
  
  if (!data.payload) {
    errors.payload_type = ['This field is required'];
  } else {
    let payloadType = Object.keys(data.payload)[0];
    switch (payloadType) {
      case 'splashpagePlusCTA':
        if (!data.payload[payloadType].pathname)
          errors.payload_pathname = ['This field is required'];
        
        if (!data.payload[payloadType].search)
          errors.payload_search = ['This field is required'];
        break;
      case 'transferBubble':
        if (data.payload[payloadType].delay === null)
          errors.payload_delay = ['This field is required'];
        else if (isNaN(data.payload[payloadType].delay))
          errors.payload_delay = ['Provide a valid number'];
        
        if (data.payload[payloadType].timeout === null)
          errors.payload_timeout = ['This field is required'];
        else if (isNaN(data.payload[payloadType].timeout))
          errors.payload_timeout = ['Provide a valid number'];

        if (!data.payload[payloadType].textContent)
          errors.payload_textContent = ['This field is required'];

        if (!data.payload[payloadType].when)
          errors.payload_when = ['This field is required'];

        if (data.payload[payloadType].buttonText && !data.payload[payloadType].buttonAction)
          errors.payload_buttonAction = ['This field is required'];
        break;
      case 'mobileHeader':
        if (!data.payload[payloadType].pathname)
          errors.payload_pathname = ['This field is required'];

        if (!data.payload[payloadType].text)
          errors.payload_text = ['This field is required'];
        break;
      case 'custom':
        if (!data.payload[payloadType].content) {
          errors.payload_content = ['This field is required'];
        } else {
          try {
            JSON.stringify(data.payload[payloadType].content);
          } catch (e) {
            errors.payload_content = ['Provide a valid JSON'];
          }
        }
        break;
    }
  }

  return errors;
};

export const actions = ActionHelper.types([
  'SET_NEW_VARIANT_VALUES',
  'RESET_NEW_VARIANT'
]);

export default ActionHelper.generate({
  setValues(data) {
    return dispatch => {
      dispatch({
        type: actions.SET_NEW_VARIANT_VALUES,
        data
      });
    };
  },

  reset() {
    return dispatch => {
      dispatch({
        type: actions.RESET_NEW_VARIANT
      });
    };
  },

  validate(data, formName) {
    return (dispatch, getState) => {
      const {experiment} = getState();
      const validationErrors = validate(data, experiment.data.variants);
      if (Object.keys(validationErrors).length) {
        dispatch({
          type: ValidationErrorsActions.SET_VALIDATION_ERRORS,
          form: formName,
          errors: validationErrors
        });
        throw 'ValidationErrors';
      }
    };
  }
});
