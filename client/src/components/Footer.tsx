import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      py={2}
      mt="auto"
      textAlign="center"
      bgcolor="#000957"
    >
      <Typography variant="body2" sx={{ color: 'white' }}>
        © {new Date().getFullYear()} YourApp. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
