// next/image loader (next.config.mjs). Wikimedia Commons serves thumbnails in fixed widths only - any
// other width is answered with an error - so each width the browser asks for is rounded up to one of
// them. A phone then loads a 500 or 1280 px photo instead of the 1920 px one (SRS 3.3.1, 3.3.2).
export const WIKIMEDIA_WIDTHS = [250, 330, 500, 960, 1280, 1920];

const THUMB_WIDTH = /\/\d+px-/;

export default function imageLoader({ src, width }) {
  if (THUMB_WIDTH.test(src)) {
    const step = WIKIMEDIA_WIDTHS.find((w) => w >= width) || WIKIMEDIA_WIDTHS.at(-1);
    return src.replace(THUMB_WIDTH, `/${step}px-`);
  }
  // Files in public/ and full-size originals are served as they are
  return src.startsWith('/') ? `${src}?w=${width}` : src;
}
