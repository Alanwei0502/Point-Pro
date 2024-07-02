import React from 'react';
import ReactDOM from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { App } from './router/App';
import { theme } from './theme';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

const root = document.getElementById('root')!;

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
      <ToastContainer position='top-center' limit={3} hideProgressBar autoClose={1000} />
    </ThemeProvider>
  </React.StrictMode>,
);
