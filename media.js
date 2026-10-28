/* =========================================================
   Turns a normal YouTube or Google Drive link into a player.
   You never need to edit this file.
   ========================================================= */

function toEmbedUrl(url) {
  if (!url) return null;

  // Google Drive file (video or PDF): .../file/d/ID/...  ->  /preview
  const drive = url.match(/drive\.google\.com\/file\/d\/([^/?]+)/);
  if (drive) return 'https://drive.google.com/file/d/' + drive[1] + '/preview';

  // YouTube playlist
  const list = url.match(/[?&]list=([^&]+)/);
  if (url.includes('youtube.com/playlist') && list) {
    return 'https://www.youtube.com/embed/videoseries?list=' + list[1];
  }

  // YouTube video: youtu.be/ID, watch?v=ID, shorts/ID
  const yt = url.match(/youtu\.be\/([^?&/]+)/) ||
             url.match(/youtube\.com\/shorts\/([^?&/]+)/) ||
             url.match(/[?&]v=([^&]+)/);
  if (yt) return 'https://www.youtube.com/embed/' + yt[1];

  return null;
}

/* Builds: player + the link written underneath */
function buildPlayer(url, opts) {
  opts = opts || {};
  const wrap = document.createDocumentFragment();

  const box = document.createElement('div');
  box.className = 'media' + (opts.pdf ? ' pdf' : '');

  const src = toEmbedUrl(url);
  if (src) {
    const frame = document.createElement('iframe');
    frame.src = src;
    frame.loading = 'lazy';
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    box.appendChild(frame);
  } else {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'Video coming soon';
    box.appendChild(empty);
  }
  wrap.appendChild(box);

  if (src && !opts.hideLink) {
    const a = document.createElement('a');
    a.className = 'media-link';
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = url;
    wrap.appendChild(a);
  }
  return wrap;
}
