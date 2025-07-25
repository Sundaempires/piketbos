export default function manifest() {
    return {
        name: 'Piket Bos?',
        short_name: 'Piket Bos?',
        description: 'A Progressive Web App built with Next.js',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
            {
                src: '/192-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/512-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    }
}