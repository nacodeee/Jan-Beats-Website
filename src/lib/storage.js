import { supabase } from './supabase';

// Public bucket URLs (covers, previews are public buckets)
export function getPublicUrl(bucket, path) {
  if (!path) return null;
  // If path starts with / it's a local public asset, not a storage path
  if (path.startsWith('/')) return path;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl || null;
}

// Private bucket signed URL (masters, stems — server-side only via /api/download)
export function getCoverUrl(coverPath) {
  return getPublicUrl('covers', coverPath);
}

export function getPreviewUrl(previewPath) {
  if (!previewPath) return null;
  if (previewPath.startsWith('/')) return previewPath;
  return getPublicUrl('previews', previewPath);
}
