import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CssBaseline, GlobalStyles, Box } from '@mui/material';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './components/Login';
import Signup from './components/Signup';
import Header from './components/Header';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <GlobalStyles
        styles={{
          html: { height: '100%', overflow: 'hidden' },
          body: { height: '100%', overflow: 'hidden', margin: 0, padding: 0 },
          '#root': { height: '100%', overflow: 'hidden' },
        }}
      />
      <BrowserRouter>
        <Box display="flex" flexDirection="column" height="100vh" overflow="hidden">
          <Header />
          <Box component="main" flexGrow={1} overflow="auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </BrowserRouter>
    </>
  );
};

export default App;
