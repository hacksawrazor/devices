import { useEffect, useState } from 'react';
import { Alert, Box, Button, CircularProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import AddDeviceForm, { type DeviceRecord } from '../components/AddDeviceForm';
import { urls } from '../config/urls';

export default function DeviceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState<DeviceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadDevice = async () => {
      try {
        const response = await fetch(`${urls.devicesApi}/${encodeURIComponent(id || '')}`, { credentials: 'include' });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
        if (active) setDevice(data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Failed to load device');
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadDevice();
    return () => { active = false; };
  }, [id]);

  return (
    <Box sx={{ maxWidth: 1240, mx: 'auto', px: { xs: 3, md: 6 }, py: { xs: 4, md: 7 }, minHeight: '65vh' }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress color="primary" /></Box>
      ) : error || !device ? (
        <Box sx={{ maxWidth: 960, mx: 'auto', mt: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>{error || 'Device not found'}</Alert>
          <Button onClick={() => navigate('/devices')} startIcon={<ArrowBack />} sx={{ color: 'rgba(244,247,239,.62)' }}>
            Back to devices
          </Button>
        </Box>
      ) : (
        <AddDeviceForm device={device} onBack={() => navigate('/devices')} onDeleted={() => navigate('/devices')} />
      )}
    </Box>
  );
}
