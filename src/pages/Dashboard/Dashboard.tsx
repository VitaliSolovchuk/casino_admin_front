import React, { useState } from 'react';
import { Col } from 'reactstrap';
import WelcomeComp from 'entities/welcomeComp/ui/WelcomeComp';
import {
  Typography, TextField, Button, Snackbar, Alert,
} from '@mui/material';
import { names } from 'shared/lib/consts/names';
import { useMutationRequest } from 'shared/lib/hooks/useMutationRequest';
import { postUpdateServerKeysData } from '../../features/dashboard/api/index';

const Dashboard = () => {
  const [accessKey, setAccessKey] = useState('');
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Использование кастомного хука
  const { mutate, isLoading } = useMutationRequest(
    'reset-keys',
    () => postUpdateServerKeysData({ key: accessKey }),
  );

  // Обработчик нажатия кнопки Reset Keys
  const handleResetKeys = () => {
    if (!accessKey.trim()) {
      setSnackbarMessage('Access Key is required.');
      setSnackbarSeverity('error');
      setIsSnackbarOpen(true);
      return;
    }

    mutate(undefined, {
      onSuccess: (data) => {
        setSnackbarMessage(data || 'Keys updated successfully!');
        setSnackbarSeverity('success');
        setIsSnackbarOpen(true);
      },
      onError: (error: any) => {
        setSnackbarMessage(error?.message || 'Failed to update keys.');
        setSnackbarSeverity('error');
        setIsSnackbarOpen(true);
      },
    });
  };

  // Закрытие Snackbar
  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  return (
    <div>
      <Typography variant="h6" sx={{ mb: 2 }}>{names.Dashboard}</Typography>
      <Col xl="4">
        <WelcomeComp />
      </Col>

      <div style={{ marginTop: '20px' }}>
        <TextField
          label="Access Key"
          variant="outlined"
          fullWidth
          value={accessKey}
          onChange={(e) => setAccessKey(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          // onClick={handleResetKeys}
          disabled={isLoading}
        >
          Reset Keys
        </Button>
      </div>

      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Dashboard;
