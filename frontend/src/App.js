import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StockTable from './StockTable';
import StockDetail from './StockDetail';
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, IconButton, Box, Container } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Toaster } from 'react-hot-toast';

function App() {
  const [darkMode, setDarkMode] = useState(true);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#009688' }, // Teal for modern fintech feel
      secondary: { main: '#ff9800' }, // Amber for accents
      background: {
        default: darkMode ? '#0d1117' : '#f7f9fc', // GitHub-inspired dark/light
        paper: darkMode ? '#161b22' : '#ffffff',
      },
      success: { main: '#4caf50' },
      error: { main: '#f44336' },
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
      h4: { fontWeight: 700, color: 'primary.main' },
      h6: { fontWeight: 600 },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 16px 48px rgba(0,0,0,0.2)' },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            '&:hover': { transform: 'scale(1.05)' },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} /> {/* Toast notifications */}
      <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #009688 0%, #4caf50 100%)', boxShadow: 4 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: 1 }}>
            RealTicker - AI Stock Insights
          </Typography>
          <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit" sx={{ '&:hover': { transform: 'rotate(180deg)', transition: '0.5s' } }}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4, minHeight: '100vh', background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)` }}>
        <Router>
          <Routes>
            <Route path="/" element={<StockTable />} />
            <Route path="/stock/:ticker" element={<StockDetail />} />
          </Routes>
        </Router>
      </Container>
    </ThemeProvider>
  );
}

export default App;