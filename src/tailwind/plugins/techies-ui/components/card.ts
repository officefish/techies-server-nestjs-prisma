export const card = {
  '.card': {
    '@apply relative flex flex-col': {},
    '&:focus': {
      '@apply outline-none': {},
    },

    '&-body': {
      '@apply flex flex-auto flex-col': {},
      ':where(p)': {
        '@apply flex-grow': {},
      },
    },

    '&-actions': {
      '@apply flex flex-wrap items-start gap-2': {},
    },

    '& figure': {
      '@apply flex items-center justify-center': {},
    },

    '&.image-full': {
      '@apply grid': {},

      '&:before': {
        '@apply relative': {},
        content: "''",
      },

      '&:before, & > *': {
        '@apply col-start-1 row-start-1': {},
      },

      '& > figure img': {
        '@apply h-full object-cover': {},
      },
    },

    '&.image-full > &-body': {
      '@apply relative': {},
    },
  },
}
