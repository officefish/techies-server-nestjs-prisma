export const stat = {
  '.stats': {
    '@apply inline-grid': {},
  },
  ':where(.stats)': {
    '@apply grid-flow-col': {},
  },

  '.stat': {
    '@apply inline-grid w-full': {},
    'grid-template-columns': 'repeat(1, 1fr)',

    '&-figure': {
      '@apply col-start-2 row-span-3 row-start-1 place-self-center justify-self-end':
        {},
    },

    '&-title': {
      '@apply col-start-1 whitespace-nowrap': {},
    },

    '&-value': {
      '@apply col-start-1 whitespace-nowrap': {},
    },

    '&-desc': {
      '@apply col-start-1 whitespace-nowrap': {},
    },

    '&-actions': {
      '@apply col-start-1 whitespace-nowrap': {},
    },
  },
}
