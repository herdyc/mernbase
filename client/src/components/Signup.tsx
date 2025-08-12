// components/Signup.tsx
import React from 'react';
import { Box, TextField, Typography, Button, Link } from '@mui/material';

interface SignupProps {
  onSwitch?: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSwitch }) => {
  return (
    <Box width="100%" maxWidth="400px" textAlign="center">
      <Typography variant="h4" mb={3}>
        Create an Account
      </Typography>
      <TextField fullWidth label="Full Name" margin="normal" />
      <TextField fullWidth label="Email" margin="normal" />
      <TextField fullWidth label="Password" type="password" margin="normal" />
      <Button fullWidth variant="contained" color="primary" sx={{ mt: 3 }}>
        Sign Up
      </Button>
      {onSwitch && (
        <Typography mt={2}>
          Already have an account?{' '}
          <Link component="button" onClick={onSwitch}>
            Log in
          </Link>
        </Typography>
      )}
    </Box>
  );
};

export default Signup;
