const AUTH_TOKEN_EVENT = 'auth-token-changed';

export const emitAuthTokenChanged = () => {
  window.dispatchEvent(new Event(AUTH_TOKEN_EVENT));
};

export const onAuthTokenChanged = (handler: () => void) => {
  window.addEventListener(AUTH_TOKEN_EVENT, handler);
  return () => window.removeEventListener(AUTH_TOKEN_EVENT, handler);
};
