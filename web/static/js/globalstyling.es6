import * as CONSTANTS from 'appconstants';

let stateColors = {};
stateColors[CONSTANTS.EXPERIMENT_STATE_DRAFT] = '#E1F5FE';
stateColors[CONSTANTS.EXPERIMENT_STATE_RUNNING] = '#F1F8E9';
stateColors[CONSTANTS.EXPERIMENT_STATE_STOPPED] = '#FFF3E0';
stateColors[CONSTANTS.EXPERIMENT_STATE_TERMINATED] = '#FFCDD2';

export default {
  emptyTD: {
    textAlign: 'center'
  },
  flatButton: {
    marginRight: 10
  },
  chipLabel: {
    fontSize: 13
  },
  stateColors: stateColors
};