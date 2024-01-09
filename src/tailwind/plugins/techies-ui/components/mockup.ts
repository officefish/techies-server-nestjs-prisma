export const mockup = {
  '.mockup': {
    '&-code': {
      '@apply relative overflow-hidden overflow-x-auto': {},
      'pre[data-prefix]': {
        '&:before': {
          content: 'attr(data-prefix)',
          '@apply inline-block text-right': {},
        },
      },
    },

    '&-window': {
      '@apply relative overflow-hidden overflow-x-auto': {},
      'pre[data-prefix]': {
        '&:before': {
          content: 'attr(data-prefix)',
          '@apply inline-block text-right': {},
        },
      },
    },
  },
}
