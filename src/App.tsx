import { ThemeProvider, createTheme, CssBaseline, Box, Typography, Button, Link } from '@mui/material';
import { AutoAwesome, ArrowOutward } from '@mui/icons-material';
import { Routes, Route, Link as RouterLink } from 'react-router-dom';
import ThreeBackground from './components/ThreeBackground';
import HomePage from './pages/HomePage';
import AddDevicePage from './pages/AddDevicePage';
import DevicesPage from './pages/DevicesPage';

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
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', bgcolor: '#101312', color: '#f4f7ef' }}>
        <ThreeBackground />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box component="header" sx={{ maxWidth: 1240, mx: 'auto', px: { xs: 3, md: 6 }, py: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link component={RouterLink} to="/" underline="none" sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#f4f7ef' }}>
              <AutoAwesome sx={{ color: '#b8f34a' }} />
              <Typography sx={{ fontWeight: 700, fontSize: '1.2rem' }}>Hacksaw</Typography>
            </Link>
            <Box component="nav" sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
              <Link component={RouterLink} to="/" sx={{ color: 'rgba(244,247,239,.7)', textDecoration: 'none' }}>Approach</Link>
              <Link component={RouterLink} to="/" sx={{ color: 'rgba(244,247,239,.7)', textDecoration: 'none' }}>Signal</Link>
              <Link component={RouterLink} to="/" sx={{ color: 'rgba(244,247,239,.7)', textDecoration: 'none' }}>Contact</Link>
              <RouterLink to="/add-device" style={{ color: '#b8f34a', textDecoration: 'none', fontWeight: 600 }}>Add Device</RouterLink>
              <RouterLink to="/devices" style={{ color: '#b8f34a', textDecoration: 'none', fontWeight: 600 }}>Devices</RouterLink>
            </Box>
            <Button component={RouterLink} to="/add-device" variant="outlined" endIcon={<ArrowOutward />} sx={{ borderColor: 'rgba(244,247,239,.35)', color: '#f4f7ef', px: 2.5 }}>Start a project</Button>
          </Box>

          <Box component="main">
            <Routes>
              <Route path="/add-device" element={<AddDevicePage />} />
              <Route path="/devices" element={<DevicesPage />} />
              <Route path="/" element={<HomePage />} />
            </Routes>
          </Box>

          <Box component="footer" sx={{ maxWidth: 1240, mx: 'auto', px: { xs: 3, md: 6 }, py: 4, display: 'flex', justifyContent: 'space-between', color: 'rgba(244,247,239,.45)', fontSize: '.8rem' }}>
            <Typography variant="body2">© 2026 Hacksaw Studio</Typography>
            <Typography variant="body2">Strategy with an edge.</Typography>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
