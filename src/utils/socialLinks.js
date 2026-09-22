export function instagramProfile(value) {
  const rawValue = String(value || '').trim();
  if (!rawValue) return null;

  if (/^https?:\/\//i.test(rawValue)) {
    try {
      const url = new URL(rawValue);
      if (!/(^|\.)instagram\.com$/i.test(url.hostname)) return null;
      const handle = url.pathname.split('/').filter(Boolean)[0]?.replace(/^@/, '');
      return handle ? { handle, href: rawValue } : null;
    } catch {
      return null;
    }
  }

  const handle = rawValue.replace(/^[@#]/, '').split(/[/?#]/)[0];
  if (!/^[a-z0-9._]+$/i.test(handle)) return null;
  return { handle, href: `https://instagram.com/${handle}` };
}
