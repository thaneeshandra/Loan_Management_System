import {jwtDecode} from 'jwt-decode';

export const getAuthFromStorage = () => {
  const token = localStorage.getItem('jwtToken');
  const userRole = localStorage.getItem('userRole');
  return { token, userRole };
};

export const saveAuthToStorage = ({ token, userRole }) => {
  localStorage.setItem('jwtToken', token);
  localStorage.setItem('userRole', userRole);
};

export const clearAuthFromStorage = () => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('userRole');
};

export const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};
