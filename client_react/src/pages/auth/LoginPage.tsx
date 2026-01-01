import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, TextField, Button, Typography, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { login } from '../../store/authSlice';

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const result = await dispatch(login({ username, password }));
    if (login.fulfilled.match(result)) {
      navigate('/dashboard');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '100%',
          mx: 2,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
          מנהל וידאו
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
          התחבר למערכת
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="שם משתמש"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            required
            autoFocus
          />
          <TextField
            fullWidth
            label="סיסמה"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            size="large"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? 'מתחבר...' : 'התחבר'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};
