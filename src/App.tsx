import React, { useEffect } from 'react';
import Routes from './Routes';
import { useAuth } from './context/AuthContext';
import { validateAccessToken, refreshAccessToken } from './services/tokenService';

const App: React.FC = () => {
  const { accessToken, refreshToken, user, logout, updateTokens, setLoading } = useAuth();

  useEffect(() => {
    const validateTokens = async () => {
      // If no tokens, nothing to validate
      if (!accessToken && !refreshToken) {
        setLoading(false);
        return;
      }

      // If we have an access token, validate it
      if (accessToken) {
        const validation = await validateAccessToken(accessToken);
        
        if (validation.valid) {
          // Token is valid, we're good
          setLoading(false);
          return;
        }
      }

      // Access token is invalid or expired, try to refresh
      if (refreshToken) {
        const newTokens = await refreshAccessToken(refreshToken);
        
        if (newTokens) {
          // Successfully refreshed tokens
          updateTokens(newTokens.access_token, newTokens.refresh_token);
          setLoading(false);
          return;
        }
      }

      // Both tokens are invalid, logout user
      logout();
      setLoading(false);
    };

    validateTokens();
  }, []); // Run only once on mount

  return (
    <Routes />
  );
};

export default App;
