export const avatar = {

    '.avatar': {
        
        '&.online': {
            
            '&:before': {
                content: "''",
                '@apply absolute z-10 block rounded-full': {},
                '@apply bg-success dark:bg-success-dark': {},
                width: '15%',
                height: '15%',
                top: '7%',
                right: '7%',
                'box-shadow': '0 0 0 2px hsl(var(--b1))',

                ':is(.dark) &': {
                    'box-shadow': '0 0 0 2px hsl(var(--b1-d))'
                }
            }
        },

        '&.offline': {
            '&:before': {
                content: "''",
                '@apply absolute z-10 block rounded-full': {},
                '@apply bg-base-300': {},
                width: '15%',
                height: '15%',
                top: '7%',
                right: '7%',
                'box-shadow': '0 0 0 2px hsl(var(--b1))',
                
                ':is(.dark) &': {
                    'box-shadow': '0 0 0 2px hsl(var(--b1-d))',
                    '@apply bg-base-300-dark': {},
                }
          }
        }
    }
}