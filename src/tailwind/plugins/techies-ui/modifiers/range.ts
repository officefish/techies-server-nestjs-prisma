const setupRange = (colorTag: string, colorVariable: string) => {
  return {
    [`&-${colorTag}`]: {
      '--range-shdw': `var(${colorVariable})`,
      '--range-shdw-dark': `var(${colorVariable}-d)`,
    },
  }
}

export const range = {
  '.range': {
    appearance: 'none',
    '-webkit-appearance': 'none',
    '--range-shdw': 'var(--bc)',
    '--range-shdw-dark': 'var(--bc-d)',

    '@apply bg-transparent rounded-box overflow-hidden': {},

    '&:focus-visible::-webkit-slider-thumb': {
      '--focus-shadow':
        '0 0 0 6px hsl(var(--b1)) inset, 0 0 0 2rem hsl(var(--range-shdw)) inset',
      ':is(.dark) &': {
        '--focus-shadow':
          '0 0 0 6px hsl(var(--b1-d)) inset, 0 0 0 2rem hsl(var(--range-shdw-dark)) inset',
      },
    },

    '&:focus-visible::-moz-range-thumb': {
      '--focus-shadow':
        '0 0 0 6px hsl(var(--b1)) inset, 0 0 0 2rem hsl(var(--range-shdw)) inset',
      ':is(.dark) &': {
        '--focus-shadow':
          '0 0 0 6px hsl(var(--b1-d)) inset, 0 0 0 2rem hsl(var(--range-shdw-dark)) inset',
      },
    },

    '&::-webkit-slider-runnable-track': {
      '@apply h-2 w-full rounded-box': {},
      'background-color': 'hsla(var(--bc) / 0.1)',
      ':is(.dark) &': {
        'background-color': 'hsla(var(--bc-d) / 0.1)',
      },
    },

    '&::-moz-range-track': {
      '@apply h-2 w-full rounded-box': {},
      'background-color': 'hsla(var(--bc) / 0.1)',
      ':is(.dark) &': {
        'background-color': 'hsla(var(--bc-d) / 0.1)',
      },
    },

    '&::-webkit-slider-thumb': {
      'background-color': 'hsl(var(--b1))',
      '@apply relative h-6 w-6 border-none rounded-box': {},
      appearance: 'none',
      '-webkit-appearance': 'none',
      top: '50%',
      color: 'hsl(var(--range-shdw))',
      transform: 'translateY(-50%)',
      '--filler-size': '100rem',
      '--filler-offset': '0.6rem',
      'box-shadow':
        '0 0 0 3px hsl(var(--range-shdw)) inset, var(--focus-shadow, 0 0), calc(var(--filler-size) * -1 - var(--filler-offset)) 0 0 var(--filler-size)',
      ':is(.dark) &': {
        'background-color': 'hsl(var(--b1-d))',
        color: 'hsl(var(--range-shdw-dark))',
        'box-shadow':
          '0 0 0 3px hsl(var(--range-shdw-dark)) inset, var(--focus-shadow, 0 0), calc(var(--filler-size) * -1 - var(--filler-offset)) 0 0 var(--filler-size)',
      },
    },

    '&::-moz-range-thumb': {
      'background-color': 'hsl(var(--b1))',
      '@apply relative h-6 w-6 border-none rounded-box': {},
      top: '50%',
      color: 'hsl(var(--range-shdw))',
      '--filler-size': '100rem',
      '--filler-offset': '0.5rem',
      'box-shadow':
        '0 0 0 3px hsl(var(--range-shdw)) inset, var(--focus-shadow, 0 0), calc(var(--filler-size) * -1 - var(--filler-offset)) 0 0 var(--filler-size)',
      ':is(.dark) &': {
        'background-color': 'hsl(var(--b1-d))',
        color: 'hsl(var(--range-shdw-dark))',
        'box-shadow':
          '0 0 0 3px hsl(var(--range-shdw-dark)) inset, var(--focus-shadow, 0 0), calc(var(--filler-size) * -1 - var(--filler-offset)) 0 0 var(--filler-size)',
      },
    },

    ...setupRange('primary', '--p'),
    ...setupRange('secondary', '--s'),
    ...setupRange('accent', '--a'),
    ...setupRange('info', '--in'),
    ...setupRange('success', '--su'),
    ...setupRange('warning', '--wa'),
    ...setupRange('error', '--er'),
  },
}
