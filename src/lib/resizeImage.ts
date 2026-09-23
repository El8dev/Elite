/**
 * Downscale and re-encode an image in the browser before it is uploaded.
 *
 * Phone cameras produce 3-6 MB files; the showcase grid needs ~1200 px. Doing
 * this client-side keeps storage small and, more importantly, keeps the
 * projects page fast for every visitor afterwards.
 */
export interface ResizeOptions {
  /** Longest edge in px. Default 1400. */
  maxEdge?: number;
  /** JPEG/WebP quality 0..1. Default 0.82. */
  quality?: number;
  /** Output mime. Default image/webp with a JPEG fallback for old Safari. */
  type?: 'image/webp' | 'image/jpeg';
}

const loadImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
    img.src = url;
  });

export async function resizeImage(file: File, opts: ResizeOptions = {}): Promise<File> {
  const { maxEdge = 1400, quality = 0.82 } = opts;
  // GIFs (animation) and SVGs are passed through untouched.
  if (!/^image\/(jpeg|png|webp|heic|heif|avif)$/i.test(file.type)) return file;

  let img: HTMLImageElement;
  try { img = await loadImage(file); } catch { return file; }

  const scale = Math.min(1, maxEdge / Math.max(img.naturalWidth, img.naturalHeight));
  if (scale === 1 && file.size < 600 * 1024) return file; // already small enough

  const w = Math.round(img.naturalWidth * scale);
  const h = Math.round(img.naturalHeight * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, w, h);

  const type = opts.type ?? (canvas.toDataURL('image/webp').startsWith('data:image/webp') ? 'image/webp' : 'image/jpeg');
  const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, type, quality));
  if (!blob || blob.size >= file.size) return file; // never make it bigger

  const ext = type === 'image/webp' ? 'webp' : 'jpg';
  const base = file.name.replace(/\.[^.]+$/, '');
  return new File([blob], `${base}.${ext}`, { type, lastModified: Date.now() });
}
