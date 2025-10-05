export function siteUrl() {
  return 'https://jobhuntly.io.vn';
}

export function canonicalOf(path = '/') {
  const base = siteUrl().replace(/\/+$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
}

export function clip(text = '', n = 155) {
  const s = String(text).replace(/\s+/g, ' ').trim();
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}
