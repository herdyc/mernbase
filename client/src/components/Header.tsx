import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Avatar, Button } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';

const Header: React.FC = () => {
  const handleProfileClick = () => {
    // Add your logic here (e.g. open menu, navigate, logout, etc.)
    alert('Profile clicked!');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#fff', color: '#333', boxShadow: 'none', borderBottom: '1px solid #e0e0e0' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo on the left */}
        <Box display="flex" alignItems="center">
          <MenuIcon sx={{ mr: 1 }} />
          <Typography variant="h6" noWrap component="div">
            MyApp
          </Typography>
        </Box>

        {/* Navbar Links on the right */}
        <Box display="flex" alignItems="center" gap={2}>
          <Button color="inherit">Home</Button>
          <Button color="inherit">Features</Button>
          <Button color="inherit">About</Button>
          <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
            <Avatar alt="User" src="/placeholder-profile.jpg" />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
