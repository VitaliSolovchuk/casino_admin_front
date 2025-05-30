export const getUserRoleFromToken = (): 'ADMIN' | 'USER' | null => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch (e) {
    console.error('Failed to parse token:', e);
    return null;
  }
};
