import { requireSupabase, supabase } from './supabase';

export const STORAGE_BUCKET = 'hlime-public';
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function resolveImageUrl(path) {
  if (!path || /^(https?:|data:|blob:)/i.test(path)) return path || '';
  if (!supabase) return '';
  return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
}

function sanitizeFilename(filename) {
  const dot = filename.lastIndexOf('.');
  const extension = dot >= 0 ? filename.slice(dot).toLowerCase() : '';
  const basename = (dot >= 0 ? filename.slice(0, dot) : filename)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
    .slice(0, 72) || 'image';
  return `${basename}${extension}`;
}

export function validateImageFile(file) {
  if (!file) return 'Vui lòng chọn một ảnh.';
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return 'Chỉ chấp nhận JPG, PNG hoặc WebP.';
  if (file.size > MAX_IMAGE_BYTES) return 'Ảnh phải nhỏ hơn hoặc bằng 5 MB.';
  return '';
}

export async function uploadPublicImage(file, folder) {
  const validationError = validateImageFile(file);
  if (validationError) throw new Error(validationError);

  const uniquePart = typeof crypto?.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const path = `${folder}/${Date.now()}-${uniquePart}-${sanitizeFilename(file.name)}`;
  const client = requireSupabase();
  const { error } = await client.storage.from(STORAGE_BUCKET).upload(path, file, {
    cacheControl: '31536000',
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;
  return path;
}
