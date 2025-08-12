import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box display="flex" alignItems="center">
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ textDecoration: 'none', color: 'inherit' }}
          >
            YourApp.io
          </Typography>
        </Box>
        <Box>
          <Button color="inherit" component={Link} to="/recording">
            Recording
          </Button>
          <Button color="inherit" component={Link} to="/dashboard">
            Dashboard
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
