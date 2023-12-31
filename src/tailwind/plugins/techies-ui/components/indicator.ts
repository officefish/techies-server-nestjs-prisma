export const indicator = {
  '.indicator': {
    '@apply relative inline-flex': {},
    width: 'max-content',
    '& :where(.indicator-item)': {
      'z-index': 1,
      '@apply absolute transform whitespace-nowrap': {},
    },
  },
}
