// Small display helpers shared by tourist pages

export function timeAgo(date) {
  if (!date) return '';
  const minutes = Math.round((Date.now() - new Date(date).getTime()) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatTime(date) {
  return new Date(date).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

// Wikimedia thumbnails come in fixed widths; ask for one close to the display size so that
// pages stay light on slow mountain connections (SRS 2.5, 3.3.2).
export function sizedImage(url, width) {
  return url ? url.replace(/\/\d+px-/, `/${width}px-`) : url;
}

export function capitalise(text = '') {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
