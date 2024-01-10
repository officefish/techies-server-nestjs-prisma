export const divider = {
  '.divider-horizontal': {
    '@apply flex-col': {},
    '&:before': {
      '@apply h-full w-0.5': {},
    },
    '&:after': {
      '@apply h-full w-0.5': {},
    },
  },

  '.divider-vertical': {
    '@apply flex-row': {},
    '&:before': {
      '@apply h-0.5 w-full': {},
    },
    '&:after': {
      '@apply h-0.5 w-full': {},
    },
  },
}
