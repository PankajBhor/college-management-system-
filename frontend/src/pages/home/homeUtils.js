export const assetUrl = (path) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const base = process.env.REACT_APP_API_URL || '';
  const origin = base.endsWith('/api') ? base.slice(0, -4) : base;
  const normalized = String(path).replace(/\\/g, '/');
  return `${origin}/${normalized.replace(/^\/+/, '')}`;
};

export const initials = (name = '') => {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map(part => part[0]?.toUpperCase()).join('') || 'JP';
};
