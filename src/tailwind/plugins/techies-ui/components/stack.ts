export const stack = {
  '.stack': {
    '@apply inline-grid': {},
    '& > *': {
      '@apply col-start-1 row-start-1': {},
      transform: 'translateY(10%) scale(0.9)',
      'z-index': 1,
    },
    '& > *:nth-child(2)': {
      transform: 'translateY(5%) scale(0.95)',
      'z-index': 2,
    },
    '& > *:nth-child(1)': {
      transform: 'translateY(0) scale(1)',
      'z-index': 3,
    },
  },
}
