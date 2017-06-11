const EQUAL_TO = {label: 'is equal to', value: '=='};
const NOT_EQUAL_TO = {label: 'is not equal to', value: '!='};
const GREATER_THAN = {label: 'is greater than', value: '>'};
const LESS_THAN = {label: 'is less than', value: '<'};

export default {
  string: [EQUAL_TO, NOT_EQUAL_TO],
  number: [EQUAL_TO, NOT_EQUAL_TO, GREATER_THAN, LESS_THAN],
  boolean: [EQUAL_TO]
};