// Lets the site be installed on a phone's home screen and opened like an app
export default function manifest() {
  return {
    name: 'RAAAH — Crowd, weather and hazards in Northern Pakistan',
    short_name: 'RAAAH',
    description: 'Check crowd levels, weather and verified hazards before you travel north.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f4f1ea',
    theme_color: '#1c1b18',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    ],
  };
}
