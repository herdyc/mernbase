import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { Box } from '@mui/material';

const App: React.FC = () => {
  return (
    <Router>
      {/* App layout */}
      <Box display="flex" flexDirection="column" minHeight="100vh">
        {/* Top navigation */}
        <Header />

        {/* Main content area */}
        <Box component="main" flexGrow={1}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Box>

        {/* Footer stays at the bottom */}
        <Footer />
      </Box>
    </Router>
  );
};

export default App;
