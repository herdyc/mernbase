import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import Login from '../components/Login';
import Signup from '../components/Signup';

const Home: React.FC = () => {
  const theme = useTheme();

  const [panelOpen, setPanelOpen] = useState(false); // triggers width change
  const [panelReady, setPanelReady] = useState(false); // triggers rendering content inside panel
  const [isLoginView, setIsLoginView] = useState(true);

  // Delay rendering login/signup until panel has opened
  useEffect(() => {
    if (panelOpen) {
      const timer = setTimeout(() => setPanelReady(true), 600); // match panel width transition
      return () => clearTimeout(timer);
    } else {
      setPanelReady(false);
    }
  }, [panelOpen]);

  const handleBack = () => {
    setPanelOpen(false);
    setTimeout(() => {
      setIsLoginView(true);
    }, 400); // reset view after animation ends
  };

  return (
    <Box display="flex" height="100%" overflow="hidden">
      {/* Left Panel */}
      <Box
        width={panelOpen ? '70%' : '100%'}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        px={3}
        sx={{ transition: 'width 0.78s ease' }}
      >
        <Typography variant="h3" mb={3}>
          Welcome to YourApp
        </Typography>
        <Typography variant="h5" mb={5}>
          Your App subtitle
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setPanelOpen(true)}
        >
          Log In
        </Button>
      </Box>

      {/* Right Panel */}
      <Box
        width={panelOpen ? '30%' : 0}
        sx={{
          transition: 'width 0.8s ease',
          overflow: 'hidden',
          backgroundColor: theme.palette.grey[100],
          position: 'relative',
        }}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {/* Only render panel contents after the panel is visibly open */}
        {panelReady && (
          <Box
            width="100%"
            height="100%"
            px={4}
            position="relative"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            {/* Back Button */}
            <Box position="absolute" top={16} left={16}>
              <Button size="small" onClick={handleBack}>
                ← Back
              </Button>
            </Box>

            {/* Animated content switch */}
            <Box
              position="relative"
              width="100%"
              maxWidth="400px"
              sx={{
                transition: 'transform 0.5s ease, opacity 0.5s ease',
                transform: isLoginView ? 'translateX(0)' : 'translateX(-100%)',
                opacity: isLoginView ? 1 : 0,
                position: 'absolute',
              }}
            >
              <Login onSwitch={() => setIsLoginView(false)} />
            </Box>

            <Box
              position="relative"
              width="100%"
              maxWidth="400px"
              sx={{
                transition: 'transform 0.5s ease, opacity 0.5s ease',
                transform: isLoginView ? 'translateX(100%)' : 'translateX(0)',
                opacity: isLoginView ? 0 : 1,
                position: 'absolute',
              }}
            >
              <Signup onSwitch={() => setIsLoginView(true)} />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Home;
