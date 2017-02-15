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
    name: 'Transfer-Complete tooltip',
    key: 'transferCompleteGrowthBubble',
    defaults: {
      text: null,
      align: '.transfer__window',
      timeout: null,
      delay: null
    },
    schema: {
      type: 'object',
      properties: [
        {
          key: 'text',
          type: 'string',
          title: 'Text'
        },
        {
          key: 'align',
          type: 'string',
          title: 'Align',
          disabled: true
        },
        {
          key: 'timeout',
          type: 'number',
          title: 'Timeout (in milliseconds)'
        },
        {
          key: 'delay',
          type: 'number',
          title: 'Delay (in milliseconds)'
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