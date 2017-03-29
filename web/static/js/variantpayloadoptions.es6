const options = {
  none: {
    name: 'None',
    key: 'none',
    defaults: {},
    schema: {
      type: 'object',
      properties: []
    }
  },
  splashpagePlusCTA: {
    name: 'SplashPage Plus CTA link',
    key: 'splashpagePlusCTA',
    defaults: {
      pathname: null,
      search: null
    },
    schema: {
      type: 'object',
      rules: {
        pathname: {
          type: 'string',
          required: true
        },
        search: {
          type: 'string',
          required: true
        }
      },
      properties: [
        {
          key: 'pathname',
          title: 'Link*'
        },
        {
          key: 'search',
          title: 'Tracking ID*'
        }
      ]
    }
  },
  transferBubble: {
    name: 'Transfer tooltip',
    key: 'transferBubble',
    defaults: {
      text: 'ExperimentTooltip',
      align: '.transfer__window',
      delay: 0,
      timeout: 5000,
      buttonType: 'none',
      buttonText: null,
      buttonAction: null,
      buttonLink: null,
      when: 'never',
      textContent: null
    },
    schema: {
      type: 'object',
      rules: {
        when: {
          type: 'string',
          required: true
        },
        textContent: {
          type: 'string',
          required: true
        },
        delay: {
          type: 'number',
          required: true
        },
        timeout: {
          type: 'number',
          required: true
        },
        text: {
          type: 'string',
          required: true
        },
        align: {
          type: 'string'
        },
        buttonType: {
          type: 'string'
        },
        buttonText: {
          type:'string',
          requiredWhen: {
            field: 'buttonType',
            value: ['action', 'link']
          }
        },
        buttonLink: {
          type: 'string',
          requiredWhen: {
            field: 'buttonType',
            value: 'link'
          }
        },
        buttonAction: {
          type: 'string',
          requiredWhen: {
            field: 'buttonType',
            value: 'action'
          }
        }
      },
      properties: [
        {
          key: 'when',
          enum: [
            {label: 'never', value: 'never'},
            {label: 'transfer is uploading', value: 'transferInProgress'},
            {label: 'transfer is downloading', value: 'transferDownloadStarted'}
          ],
          title: 'Show tooltip when*'
        },
        {
          key: 'textContent',
          title: 'Tooltip Text*',
          uiOptions: {
            multiLine: true,
            rows: 3
          }
        },
        {
          key: 'delay',
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
        },
        {
          key: 'buttonType',
          type: 'string',
          title: 'Button Type',
          enum: [
            {label: 'none', value: 'none'},
            {label: 'link', value: 'link'},
            {label: 'action', value: 'action'}
          ]
        },
        {
          key: 'buttonText',
          type: 'string',
          title: 'Button Label'
        },
        {
          key: 'buttonLink',
          type: 'string',
          title: 'Button Link'
        },
        {
          key: 'buttonAction',
          type: 'string',
          enum: [
            {label: '', value: null},
            {label: 'Create New Transfer', value: 'createNewTransfer'}
          ],
          title: 'Button Action'
        }
      ]
    }
  },
  mobileHeader: {
    name: 'Mobile Header',
    key: 'mobileHeader',
    defaults: {
      pathname: 'downloads',
      text: null
    },
    schema: {
      type: 'object',
      rules: {
        pathname: {
          type: 'string',
          required: true
        },
        text: {
          type: 'string',
          required: true
        }
      },
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
  signupFormPlanSelectorType: {
    name: 'Singup Form - Plan Selector Type',
    key: 'signupFormPlanSelectorType',
    defaults: {
      type: 'original'
    },
    schema: {
      type: 'object',
      rules: {
        type: {
          type: 'string',
          required: true
        }
      },
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
  helpPageType: {
    name: 'Help Page Type',
    key: 'helpPageType',
    defaults: {
      type: 'original'
    },
    schema: {
      type: 'object',
      rules: {
        type: {
          type: 'string',
          required: true
        }
      },
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
  plusPageSocialProof: {
    name: 'Plus Page - Social Proof',
    key: 'plusPageSocialProof',
    defaults: {
    },
    schema: {
      type: 'object',
      rules: {
        title: {
          type: 'string'
        },
        text: {
          type: 'string',
          required: true
        },
        by: {
          type: 'string'
        }
      },
      properties: [
        {
          key: 'title',
          title: 'Title'
        },
        {
          key: 'text',
          title: 'Text*'
        },
        {
          key: 'by',
          title: 'By'
        }
      ]
    }
  },
  custom: {
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
};

export default {
  web: options
};