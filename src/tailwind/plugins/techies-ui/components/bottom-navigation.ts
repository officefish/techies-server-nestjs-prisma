export const bottomNavigation = {
    '.btm-nav': {
        '@apply flex flex-row items-center justify-around fixed bottom-0 left-0 right-0 w-full': {},
        'padding-bottom': 'env(safe-area-inset-bottom)',
        '& > *': {
            '@apply flex items-center justify-center flex-col basis-full h-full cursor-pointer relative gap-1': {}
        }
    }
} 