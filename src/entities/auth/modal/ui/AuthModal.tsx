import React, { useState } from 'react';
// import Modal from 'shared/ui/Modal/Modal';
import {
  Button, Fade, Modal, TextField, Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import { Alert } from '@mui/lab';
import Backdrop from '@mui/material/Backdrop';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
};
interface AuthModalProps {
  open: boolean;
  onLogin: (username: string, password: string) => void;
  error?: string | null;
  setError?: (error: string | null) => void
}
const AuthModal: React.FC<AuthModalProps> = ({
  open, onLogin, error, setError,
}: AuthModalProps) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = (): void => {
    onLogin(username, password);
  };

  const handleAlertClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason !== 'clickaway') setError?.(null);
  };

  return (
    <Modal
      open={open}
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Typography id="transition-modal-title" variant="h6" component="h2">
            Authorization
          </Typography>
          {error && (
          <Alert severity="error" onClose={handleAlertClose}>
            {error}
          </Alert>
          )}
          <TextField
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleLogin}
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

export default AuthModal;
