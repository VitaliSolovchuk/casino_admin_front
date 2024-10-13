import React, { useState } from 'react';
import AuthModal from 'entities/auth/modal/ui/AuthModal';
import { useNavigate } from 'react-router-dom';
import { paths } from 'shared/lib/consts/paths';
import { login } from '../../../features/login/api';

const Auth: React.FC = () => {
  const [open, setOpen] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleCloseModal = () => {
    setError(null);
    setOpen(false);
  };

  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await login({
        login: username,
        password,
      });
      localStorage.setItem('token', response.accessToken);
      handleCloseModal();
      navigate(paths.dashboard);
    } catch (error) {
      setError('Invalid username or password');
    } finally {
      setIsLoading(false);
    }

    /*  if (username === 'root' && password === 'root') {
      localStorage.setItem('loggedIn', 'true');
      handleCloseModal();
      navigate(paths.dashboard);
    } else {
      setError('Invalid username or password');
    } */
  };

  return (
    <AuthModal
      open={open}
      onLogin={handleLogin}
      error={error}
      setError={setError}
    />
  );
};

export default Auth;
