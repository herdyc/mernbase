import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const Home: React.FC = () => {
  return (
    <Box
      height="100%" // fill available vertical space
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      px={3}
    >
      <Typography variant="h3" mb={3}>
        Welcome to My App
      </Typography>
      <Typography variant="h5" mb={5}>
        XXXXXXXX
      </Typography>
      <Button variant="contained" color="primary" href="/dashboard">
        Start
      </Button>
    </Box>
  );
};

export default Home;
