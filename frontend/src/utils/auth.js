import { jwtDecode } from 'jwt-decode';
export function saveToken(token) {
  localStorage.setItem('token', token);
}

export function getRole() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const decoded = jwtDecode(token);
  return decoded.role;
}

export function logout() {
  localStorage.removeItem('token');
}

export function isAuthenticated() {
  return !!localStorage.getItem('token');
}
