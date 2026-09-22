export function normalizePhone(value) {
  return String(value || '').trim().replace(/[\s.-]/g, '');
}

export function isValidVietnamPhone(value) {
  return /^(?:0\d{9}|\+84\d{9})$/.test(normalizePhone(value));
}
