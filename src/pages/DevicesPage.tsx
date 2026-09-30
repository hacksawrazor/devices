import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Typography,
} from '@mui/material';
import { Add, DevicesOther, Refresh } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

interface Device {
  deviceId: string;
  name: string;
  type: string;
  traits: string[];
  willReportState: boolean;
  meta?: { state?: { on?: boolean }; [key: string]: unknown };
}

const DEVICES_API_URL = 'https://apis.hacksaw.in/devices/api/devices';

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDevices = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(DEVICES_API_URL, { credentials: 'include' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
      if (!Array.isArray(data)) throw new Error('Unexpected response from the devices API');
      setDevices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load devices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDevices();
  }, []);

  return (
    <Box sx={{ maxWidth: 1240, mx: 'auto', px: { xs: 3, md: 6 }, py: { xs: 6, md: 10 }, minHeight: '65vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'start', sm: 'end' }, gap: 3, mb: 5, flexDirection: { xs: 'column', sm: 'row' } }}>
        <Box>
          <Typography sx={{ color: '#b8f34a', fontSize: '.78rem', letterSpacing: '.16em', textTransform: 'uppercase', fontWeight: 700, mb: 2 }}>
            Smart home
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: '2.8rem', md: '4.5rem' }, lineHeight: 1, mb: 2 }}>
            Your devices
          </Typography>
          <Typography sx={{ color: 'rgba(244,247,239,.62)' }}>
            {loading ? 'Loading your connected devices…' : `${devices.length} ${devices.length === 1 ? 'device' : 'devices'} registered`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" startIcon={<Refresh />} onClick={() => void loadDevices()} disabled={loading} sx={{ color: '#f4f7ef', borderColor: 'rgba(244,247,239,.3)' }}>
            Refresh
          </Button>
          <Button component={RouterLink} to="/add-device" variant="contained" startIcon={<Add />} sx={{ bgcolor: '#b8f34a', color: '#101312' }}>
            Add device
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress color="primary" /></Box>
      ) : devices.length === 0 && !error ? (
        <Box sx={{ textAlign: 'center', py: 10, border: '1px dashed rgba(244,247,239,.2)', bgcolor: 'rgba(244,247,239,.03)' }}>
          <DevicesOther sx={{ fontSize: 48, color: '#62d8ff', mb: 2 }} />
          <Typography variant="h5" sx={{ mb: 1 }}>No devices yet</Typography>
          <Typography sx={{ color: 'rgba(244,247,239,.58)', mb: 3 }}>Add your first device to get started.</Typography>
          <Button component={RouterLink} to="/add-device" variant="contained" startIcon={<Add />} sx={{ bgcolor: '#b8f34a', color: '#101312' }}>Add device</Button>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
          {devices.map((device) => (
            <Card key={device.deviceId} sx={{ minWidth: 0, bgcolor: 'rgba(24, 29, 27, .86)', border: '1px solid rgba(244,247,239,.12)' }}>
              <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 2, mb: 2 }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="h6" sx={{ overflowWrap: 'anywhere' }}>{device.name}</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(244,247,239,.5)', mt: .5, overflowWrap: 'anywhere' }}>{device.deviceId}</Typography>
                  </Box>
                  <Chip size="small" label={device.meta?.state?.on ? 'On' : 'Off'} sx={{ bgcolor: device.meta?.state?.on ? 'rgba(184,243,74,.15)' : 'rgba(244,247,239,.08)', color: device.meta?.state?.on ? '#b8f34a' : 'rgba(244,247,239,.7)' }} />
                </Box>
                <Typography variant="body2" sx={{ color: '#62d8ff', mb: 2, overflowWrap: 'anywhere' }}>{device.type?.replace('action.devices.types.', '') || 'Unknown type'}</Typography>
                <Box sx={{ display: 'flex', gap: .75, flexWrap: 'wrap', mb: 2 }}>
                  {(device.traits || []).map((trait) => <Chip key={trait} size="small" variant="outlined" label={trait.replace('action.devices.traits.', '')} sx={{ borderColor: 'rgba(244,247,239,.2)', color: 'rgba(244,247,239,.7)' }} />)}
                  {(!device.traits || device.traits.length === 0) && <Typography variant="caption" sx={{ color: 'rgba(244,247,239,.45)' }}>No traits listed</Typography>}
                </Box>
                <Typography variant="caption" sx={{ color: 'rgba(244,247,239,.48)' }}>
                  {device.willReportState ? 'Reports state proactively' : 'State reporting disabled'}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
