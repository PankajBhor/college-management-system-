export const assetUrl = (path) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const base = process.env.REACT_APP_API_URL || '';
  const isUploadPath = /^\/?uploads\//i.test(String(path));
  let origin = base.endsWith('/api') ? base.slice(0, -4) : base;

  if (!origin && isUploadPath && typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location;
    const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';
    origin = isLocalHost && port !== '8080' ? `${protocol}//${hostname}:8080` : '';
  }

  const normalized = String(path).replace(/\\/g, '/');
  return `${origin}/${normalized.replace(/^\/+/, '')}`;
};

export const initials = (name = '') => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map(part => part[0]?.toUpperCase()).join('') || 'JP';
};
