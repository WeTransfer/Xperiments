const options = [
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
          title: 'Link'
        },
        {
          key: 'search',
          type: 'string',
          title: 'Tracking ID'
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
      timeout: null,
      delay: null,
      buttonText: null,
      buttonAction: null,
      when: 'transferInProgress'
    },
    schema: {
      type: 'object',
      properties: [
        {
          key: 'delay',
          type: 'number',
          title: 'Show after (in milliseconds)'
        },
        {
          key: 'timeout',
          type: 'number',
          title: 'For a period of (in milliseconds)'
        },
        {
          key: 'when',
          type: 'string',
          enum: [
            {label: 'upload is in progress', value: 'transferInProgress'},
            {label: 'transfer upload is complete', value: 'transferComplete'},
            {label: 'transfer download has started', value: 'transferDownloadStarted'},
          ],
          title: 'When'
        },
        {
          key: 'textContent',
          type: 'string',
          title: 'what',
          uiOptions: {
            multiLine: true,
            rows: 3
          }
        },
        {
          key: 'buttonText',
          type: 'string',
          title: 'Button Text'
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
      pathname: null,
      text: null
    },
    schema: {
      type: 'object',
      properties: [
        {
          key: 'pathname',
          type: 'string',
          title: 'Pathname'
        },
        {
          key: 'text',
          type: 'string',
          title: 'Text',
          uiOptions: {
            multiLine: true,
            rows: 2
          }
        }
      ]
    }
  },
  {
    name: 'Custom',
    key: 'custom',
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