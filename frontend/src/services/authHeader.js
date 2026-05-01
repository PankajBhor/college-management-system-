export function getAuthHeader() {
  const token = localStorage.getItem('authToken');
  return token ? `Basic ${token}` : null;
}
