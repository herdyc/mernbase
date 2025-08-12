// components/Login.tsx
import React from 'react';
import { Box, TextField, Typography, Button, Link } from '@mui/material';

interface LoginProps {
  onSwitch?: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitch }) => {
  return (
    <Box width="100%" maxWidth="400px" textAlign="center">
      <Typography variant="h4" mb={3}>
        Login to Your Account
      </Typography>
      <TextField fullWidth label="Email" margin="normal" />
      <TextField fullWidth label="Password" type="password" margin="normal" />
      <Button fullWidth variant="contained" color="primary" sx={{ mt: 3 }}>
        Login
      </Button>
      {onSwitch && (
        <Typography mt={2}>
          No account?{' '}
          <Link component="button" onClick={onSwitch}>
            Sign up
          </Link>
        </Typography>
      )}
    </Box>
  );
};

export default Login;
