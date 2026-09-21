export function textFor(value, locale = 'vi') {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return value;
  return value[locale] || value.vi || '';
}

export function money(value) {
  return `${new Intl.NumberFormat('vi-VN').format(value)}₫`;
}

export function localizedPath(path, locale) {
  if (!path.startsWith('/')) return path;
  if (locale !== 'ko') return path;
  return path === '/' ? '/ko' : `/ko${path}`;
}

export function pathWithoutLocale(pathname) {
  const normalized = pathname.replace(/^\/ko(?=\/|$)/, '');
  return normalized || '/';
}

