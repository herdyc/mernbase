import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 4,
        mt: 'auto',
        backgroundColor: '#f5f5f5',
        textAlign: 'center',
        borderTop: '1px solid #ddd'
      }}
    >
      <Typography variant="body2" color="text.secondary">
        YourApp © 2025
      </Typography>
    </Box>
  );
};

export default Footer;
