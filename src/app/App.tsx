import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Router } from './router';
import { Providers } from './providers';
import { useAuthStore } from '../store/authStore';

const App: React.FC = () => {
  const { setMode } = useAuthStore();

  useEffect(() => {
    const port = window.location.port;
    const mode = port === '3000' ? 'server' : 'outlet';
    setMode(mode);
  }, [setMode]);

  return (
    <BrowserRouter>
      <Providers>
        <Router />
      </Providers>
    </BrowserRouter>
  );
};

export default App;
