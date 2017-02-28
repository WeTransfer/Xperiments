const options = [
  {
    name: 'None',
    key: 'none',
    defaults: {},
    schema: {
      type: 'object',
      properties: []
    }
  },
  {
    name: 'SplashPage Plus CTA link',
    key: 'splashpagePlusCTA',
    defaults: {
      pathname: null,
      search: null
    },
    schema: {
      type: 'object',
      properties: [
        {
          key: 'pathname',
          type: 'string',
          title: 'Link*'
        },
        {
          key: 'search',
          type: 'string',
          title: 'Tracking ID*'
        }
      ]
    }
  },
  {
    name: 'Transfer tooltip',
    key: 'transferBubble',
    defaults: {
      text: 'ExperimentTooltip',
      align: '.transfer__window',
      delay: 0,
      timeout: 5000,
      buttonText: null,
      buttonAction: null,
      when: null
    },
    schema: {
      type: 'object',
      properties: [
        {
          key: 'when',
          type: 'string',
          enum: [
            {label: '', value: null},
            {label: 'transfer is uploading', value: 'transferInProgress'},
            {label: 'transfer is downloading', value: 'transferDownloadStarted'}
          ],
          title: 'Show tooltip when*'
        },
        {
          key: 'textContent',
          type: 'string',
          title: 'Tooltip Text*',
          uiOptions: {
            multiLine: true,
            rows: 3
          }
        },
        {
          key: 'delay',
          type: 'number',
          title: 'Show after (seconds)*',
          enum: [
            {label: '0', value: 0},
            {label: '1', value: 1000},
            {label: '2', value: 2000},
            {label: '3', value: 3000},
            {label: '4', value: 4000},
            {label: '5', value: 5000},
            {label: '10', value: 10000},
            {label: '15', value: 15000},
            {label: '20', value: 20000}
          ]
        },
        {
          key: 'timeout',
          type: 'number',
          title: 'For a period of (seconds)*',
          enum: [
            {label: '0', value: 0},
            {label: '1', value: 1000},
            {label: '2', value: 2000},
            {label: '3', value: 3000},
            {label: '4', value: 4000},
            {label: '5', value: 5000},
            {label: '10', value: 10000},
            {label: '15', value: 15000},
            {label: '20', value: 20000}
          ]
        },
        {
          key: 'buttonText',
          type: 'string',
          title: 'Button Text',
          requires: ['buttonAction']
        },
        {
          key: 'buttonAction',
          type: 'string',
          enum: [
            {label: '', value: null},
            {label: 'Create New Transfer', value: 'createNewTransfer'}
          ],
          title: 'Button Action'
        },
        {
          key: 'text',
          type: 'string',
          title: 'Text',
          hidden: true
        },
        {
          key: 'align',
          type: 'string',
          title: 'Align',
          hidden: true
        }
      ]
    }
  },
  {
    name: 'Mobile Header',
    key: 'mobileHeader',
    defaults: {
      pathname: 'downloads',
      text: null
    },
    schema: {
      type: 'object',
      properties: [
        {
          key: 'pathname',
          type: 'string',
          title: 'Page*',
          disabled: true,
          enum: [
            {label: 'download page', value: 'downloads'}
          ]
        },
        {
          key: 'text',
          type: 'string',
          title: 'Text*',
          uiOptions: {
            multiLine: true,
            rows: 3
          }
        }
      ]
    }
  },
  {
    name: 'Singup Form - Plan Selector Type',
    key: 'signupFormPlanSelectorType',
    defaults: {
      type: 'original'
    },
    schema: {
      type: 'object',
      properties: [
        {
          key: 'type',
          type: 'string',
          title: 'Type*',
          enum: [
            {label: 'default', value: 'original'},
            {label: 'full width', value: 'fullWidthBlock'},
            {label: 'larger yearly block', value: 'largeYearlyBlock'}
          ]
        }
      ]
    }
  },
  {
    name: 'Help Page Type',
    key: 'helpPageType',
    defaults: {
      type: 'original'
    },
    schema: {
      type: 'object',
      properties: [
        {
          key: 'type',
          type: 'string',
          title: 'Type*',
          enum: [
            {label: 'default', value: 'original'},
            {label: 'New Footer - CTA - More Answers', value: 'actionToMoreAnswers'}
          ]
        }
      ]
    }
  },
  {
    name: 'Custom',
    key: 'custom',
    disabled: true,
    defaults: {
      content: null
    },
    schema: {
      type: 'object',
      properties: [
        {
          key: 'content',
          type: 'string',
          title: 'Payload',
          uiOptions: {
            multiLine: true,
            rows: 4
          }
        }
      ]
    }
  }
];

export default {web: options};