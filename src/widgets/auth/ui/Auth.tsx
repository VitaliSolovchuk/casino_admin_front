import React, { useState } from 'react';
import AuthModal from 'entities/auth/modal/ui/AuthModal';
import { useNavigate } from 'react-router-dom';
import { paths } from 'shared/lib/consts/paths';

const Auth: React.FC = () => {
  const [open, setOpen] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleCloseModal = () => {
    setError(null);
    setOpen(false);
  };

  const handleLogin = (username: string, password: string) => {
    // В реальном приложении здесь будет запрос к серверу для проверки учетных данных
    // Здесь же просто сравниваем с фиксированным значением
    if (username === 'root' && password === 'root') {
      localStorage.setItem('loggedIn', 'true');
      handleCloseModal();
      navigate(paths.dashboard);
    } else {
      setError('Invalid username or password');
    }
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
