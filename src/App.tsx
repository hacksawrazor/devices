import { ThemeProvider, createTheme, CssBaseline, Box, Typography, Button, Link, Avatar, Tooltip, Menu, MenuItem } from '@mui/material';
import { AutoAwesome, ArrowOutward } from '@mui/icons-material';
import { Routes, Route, Link as RouterLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ThreeBackground from './components/ThreeBackground';
import HomePage from './pages/HomePage';
import AddDevicePage from './pages/AddDevicePage';
import DevicesPage from './pages/DevicesPage';
import DeviceDetailsPage from './pages/DeviceDetailsPage';
import { urls } from './config/urls';
import { getLoginUrl } from './utils/getLoginUrl';
import FeedbackProvider from './components/FeedbackProvider';
import { isAuthenticated, type AuthenticatedUser } from './utils/isAuthenticated';
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
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<HTMLElement | null>(null);
  const userEmail = userInfo?.email ?? null;

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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FeedbackProvider>
      <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', bgcolor: '#101312', color: '#f4f7ef' }}>
        <ThreeBackground />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box component="header" sx={{ maxWidth: 1240, mx: 'auto', px: { xs: 3, md: 6 }, py: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link component={RouterLink} to="/" underline="none" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.2, color: '#f4f7ef' }}>
              <AutoAwesome sx={{ color: '#b8f34a' }} />
              <Typography sx={{ fontWeight: 700, fontSize: '1.2rem' }}>Hacksaw</Typography>
            </Link>
            <Button
              aria-label="Open navigation"
              aria-controls={mobileMenuAnchor ? 'mobile-navigation-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={mobileMenuAnchor ? 'true' : undefined}
              onClick={(event) => setMobileMenuAnchor(event.currentTarget)}
              sx={{ display: { xs: 'inline-flex', md: 'none' }, alignItems: 'center', gap: 1.2, color: '#f4f7ef', minWidth: 0, px: 0, '&:hover': { bgcolor: 'transparent', boxShadow: 'none' } }}
            >
              <AutoAwesome sx={{ color: '#b8f34a' }} />
              <Typography sx={{ fontWeight: 700, fontSize: '1.2rem' }}>Hacksaw</Typography>
            </Button>
            <Box component="nav" sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
              {isAuthenticated(userInfo) && (
                <RouterLink to="/devices" style={{ color: '#b8f34a', textDecoration: 'none', fontWeight: 600 }}>Devices</RouterLink>
              )}
              <Link component={RouterLink} to="/" sx={{ color: 'rgba(244,247,239,.7)', textDecoration: 'none' }}>Privacy</Link>
              <Link component={RouterLink} to="/" sx={{ color: 'rgba(244,247,239,.7)', textDecoration: 'none' }}>About</Link>
            </Box>
            <Menu
              id="mobile-navigation-menu"
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={() => setMobileMenuAnchor(null)}
              slotProps={{ paper: { sx: { minWidth: 200, bgcolor: '#181d1b', border: '1px solid rgba(244,247,239,.14)' } } }}
            >
              <MenuItem component={RouterLink} to="/" onClick={() => setMobileMenuAnchor(null)} sx={{ color: 'rgba(244,247,239,.8)' }}>
                Home
              </MenuItem>
              {isAuthenticated(userInfo) && (
                <MenuItem component={RouterLink} to="/devices" onClick={() => setMobileMenuAnchor(null)} sx={{ color: '#b8f34a' }}>
                  Devices
                </MenuItem>
              )}
              <MenuItem component={RouterLink} to="/" onClick={() => setMobileMenuAnchor(null)} sx={{ color: 'rgba(244,247,239,.8)' }}>
                Privacy
              </MenuItem>
              <MenuItem component={RouterLink} to="/" onClick={() => setMobileMenuAnchor(null)} sx={{ color: 'rgba(244,247,239,.8)' }}>
                About
              </MenuItem>
            </Menu>
            {isAuthenticated(userInfo) ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Tooltip title={userEmail} arrow>
                  <Avatar aria-label={`Signed in as ${userEmail}`} sx={{ width: 36, height: 36, bgcolor: '#b8f34a', color: '#101312', fontSize: '.85rem', fontWeight: 700, cursor: 'default' }}>
                    {userEmail.replace(/[^a-z0-9]/gi, '').slice(0, 2).toUpperCase()}
                  </Avatar>
                </Tooltip>
                <Button
                  href={developmentAuthEnabled ? undefined : urls.logout}
                  onClick={developmentAuthEnabled ? () => setUserInfo(null) : undefined}
                  variant="outlined"
                  endIcon={<ArrowOutward />}
                  sx={{ borderColor: 'rgba(244,247,239,.35)', color: '#f4f7ef', px: 2.5 }}
                >
                  {developmentAuthEnabled ? 'Sign out (dev)' : 'Logout'}
                </Button>
              </Box>
            ) : (
              developmentAuthEnabled ? (
                <Button
                  onClick={() => setUserInfo(getDevelopmentUser())}
                  variant="outlined"
                  endIcon={<ArrowOutward />}
                  sx={{ borderColor: 'rgba(244,247,239,.35)', color: '#f4f7ef', px: 2.5 }}
                >
                  Sign in (dev)
                </Button>
              ) : (
                <Button href={getLoginUrl()} variant="outlined" endIcon={<ArrowOutward />} sx={{ borderColor: 'rgba(244,247,239,.35)', color: '#f4f7ef', px: 2.5 }}>Login</Button>
              )
            )}
          </Box>

          <Box component="main">
            <Routes>
              <Route path="/devices/new" element={<AuthenticatedRoute loading={authLoading} user={userInfo}><AddDevicePage /></AuthenticatedRoute>} />
              <Route path="/devices/:id" element={<AuthenticatedRoute loading={authLoading} user={userInfo}><DeviceDetailsPage /></AuthenticatedRoute>} />
              <Route path="/devices" element={<AuthenticatedRoute loading={authLoading} user={userInfo}><DevicesPage /></AuthenticatedRoute>} />
              <Route path="/" element={<HomePage />} />
            </Routes>
          </Box>

          <Box component="footer" sx={{ maxWidth: 1240, mx: 'auto', px: { xs: 3, md: 6 }, py: 4, display: 'flex', justifyContent: 'space-between', color: 'rgba(244,247,239,.45)', fontSize: '.8rem' }}>
            <Typography variant="body2">© 2026 Hacksaw Studio</Typography>
            <Typography variant="body2">Strategy with an edge.</Typography>
          </Box>
        </Box>
      </Box>
      </FeedbackProvider>
    </ThemeProvider>
  );
}
