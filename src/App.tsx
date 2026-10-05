import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import ThreeBackground from './components/ThreeBackground';
import HomePage from './pages/HomePage';
import AddDevicePage from './pages/AddDevicePage';
import DevicesPage from './pages/DevicesPage';
import DeviceDetailsPage from './pages/DeviceDetailsPage';
import { urls } from './config/urls';
import FeedbackProvider from './components/FeedbackProvider';
import { AuthContext } from './components/authContext';
import { type AuthenticatedUser } from './utils/isAuthenticated';
import { getDevelopmentUser, isDevelopmentAuthEnabled } from '../dev/developmentAuth';
import AuthenticatedRoute from './components/AuthenticatedRoute';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#b8f34a' },
    secondary: { main: '#62d8ff' },
    background: {
      default: '#101312',
      paper: 'rgba(24, 29, 27, 0.86)',
    },
  },
  typography: {
    fontFamily: '"Space Grotesk", "Trebuchet MS", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.04em' },
    h3: { fontWeight: 700, letterSpacing: '-0.03em' },
    body1: { fontSize: '1rem', lineHeight: 1.5 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: { borderRadius: 2 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 8px 24px rgba(184, 243, 74, 0.2)' },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': { borderRadius: 2 },
        },
      },
    },
  },
});

export default function App() {
  const developmentAuthEnabled = isDevelopmentAuthEnabled();
  const [userInfo, setUserInfo] = useState<AuthenticatedUser | null>(() => (
    developmentAuthEnabled ? getDevelopmentUser() : null
  ));
  const [authLoading, setAuthLoading] = useState(!developmentAuthEnabled);

  useEffect(() => {
    if (developmentAuthEnabled) return undefined;

    let active = true;
    fetch(urls.userInfo, { credentials: 'include' })
      .then((response) => response.ok ? response.json() : null)
      .then((data: AuthenticatedUser | null) => {
        if (active) {
          setUserInfo(data);
          setAuthLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setUserInfo(null);
          setAuthLoading(false);
        }
      });
    return () => { active = false; };
  }, [developmentAuthEnabled]);

  const authContextValue = useMemo(() => ({
    userInfo,
    authLoading,
    developmentAuthEnabled,
    setUserInfo,
    onDevSignIn: () => setUserInfo(getDevelopmentUser()),
    onDevSignOut: () => setUserInfo(null),
  }), [userInfo, authLoading, developmentAuthEnabled]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FeedbackProvider>
        <AuthContext.Provider value={authContextValue}>
          <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', bgcolor: '#101312', color: '#f4f7ef' }}>
            <ThreeBackground />
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box component="main">
                <Routes>
                  <Route path="/devices/new" element={<AuthenticatedRoute loading={authLoading} user={userInfo}><AddDevicePage /></AuthenticatedRoute>} />
                  <Route path="/devices/:id" element={<AuthenticatedRoute loading={authLoading} user={userInfo}><DeviceDetailsPage /></AuthenticatedRoute>} />
                  <Route path="/devices" element={<AuthenticatedRoute loading={authLoading} user={userInfo}><DevicesPage /></AuthenticatedRoute>} />
                  <Route path="/" element={<HomePage />} />
                </Routes>
              </Box>
            </Box>
          </Box>
        </AuthContext.Provider>
      </FeedbackProvider>
    </ThemeProvider>
  );
}
