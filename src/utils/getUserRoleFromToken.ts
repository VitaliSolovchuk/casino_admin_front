export const getUserRoleFromToken = (tokenOverride?: string | null): 'ADMIN' | 'USER' | null => {
  const token = tokenOverride !== undefined ? tokenOverride : localStorage.getItem('token');
  if (!token) {
    console.log('протух токен');
    return 'ADMIN';
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch (e) {
    console.error('Failed to parse token:', e);
    return 'ADMIN';
  }
};
