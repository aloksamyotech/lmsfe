import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, StyledEngineProvider } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { Bars } from 'react-loader-spinner';
import { CirclesWithBar } from 'react-loader-spinner';
import { CartProvider } from './views/Books/CartContext';
import Routes from 'routes';
import themes from 'themes';
import NavigationScroll from 'layout/NavigationScroll';
const App = () => {
  const customization = useSelector((state) => state.customization);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [location]);
  return (
    <StyledEngineProvider injectFirst>
      <CartProvider>
        <ThemeProvider theme={themes(customization)}>
          <CssBaseline />
          <ToastContainer />
          <Box
            sx={{
              minHeight: '100vh',
              position: 'relative'
            }}
          >
            <NavigationScroll>
              <Routes />
            </NavigationScroll>
          </Box>
        </ThemeProvider>
      </CartProvider>
    </StyledEngineProvider>
  );
};
export default App;
