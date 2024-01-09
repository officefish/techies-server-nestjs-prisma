export const card = {

    '.card-compact': {
        '.card-body': {
            '@apply p-4 text-sm': {}
        },

        '.card-title': {
            '@apply mb-1': {}
        }
    },
    
    '.card-normal': {
        '.card-body': {
            padding: 'var(--padding-card, 2rem)',
            '@apply text-base': {}
        },

        '.card-title': {
            '@apply mb-3': {}
        }
    }
}
