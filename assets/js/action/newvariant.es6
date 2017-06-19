import ActionHelper from 'modules/redux-actions';
import {actions as ValidationErrorsActions} from 'action/validationerrors';

import VariantPayloadOptions from 'variantpayloadoptions';

const validate = data => {
  let errors = {};

  if (!data.name)
    errors.name = ['This field is required'];
  
  if (!data.allocation)
    errors.allocation = ['This field is required'];
  else if (isNaN(data.allocation))
    errors.allocation = ['Provide a valid number'];
  
  if (!data.payload) {
    errors.payload_type = ['This field is required'];
  } else {
    let payloadType = Object.keys(data.payload)[0];
    let propertyRules = VariantPayloadOptions.web[payloadType].schema.rules;

    if (propertyRules) {
      Object.keys(propertyRules).forEach(key => {
        const validatableValue = data.payload[payloadType][key];
        const validatableValueDataType = typeof data.payload[payloadType][key];
        const requiredDataType = propertyRules[key].type;
        
        let shouldBeValidated = false;

        // Validation is always required
        if (propertyRules[key].required) {
          shouldBeValidated = true;
        }

        // Validation requried when a certain other value is available
        if (propertyRules[key].requiredWhen) {
          const whenFieldValue = data.payload[payloadType][propertyRules[key].requiredWhen.field];
          const requiredValue = propertyRules[key].requiredWhen.value;
          
          if (typeof requiredValue === 'object' && requiredValue.indexOf(whenFieldValue) !== -1) {
            shouldBeValidated = true;
          } else if (typeof requiredValue === 'string' && requiredValue === whenFieldValue) {
            shouldBeValidated = true;
          }
        }

        // First let's see if the field is required
        if (shouldBeValidated) {
          if (validatableValue === '' || validatableValue === null) {
            errors[`payload_${key}`] = ['This field is required'];
          } else if (requiredDataType && validatableValueDataType !== requiredDataType) {
            console.log(requiredDataType, validatableValueDataType);
            errors[`payload_${key}`] = [`This field should be a ${propertyRules[key].type}`];
          }
        }
      });
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
