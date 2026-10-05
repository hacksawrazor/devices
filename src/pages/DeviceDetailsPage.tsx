import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AddDeviceForm, { type DeviceRecord } from '../components/AddDeviceForm';
import { urls } from '../config/urls';
import { getDeviceApiHeaders } from '../utils/deviceApi';
import { useFeedback } from '../components/feedbackContext';

export default function DeviceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState<DeviceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showFeedback } = useFeedback();

  useEffect(() => {
    let active = true;

    const loadDevice = async () => {
      try {
        const headers = getDeviceApiHeaders();
        const response = await fetch(`${urls.devicesApi}/${encodeURIComponent(id || '')}`, {
          credentials: 'include',
          ...(headers ? { headers } : {}),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
        if (active) setDevice(data);
      } catch (err) {
        if (active) {
          const message = err instanceof Error ? err.message : 'Failed to load device';
          setError(message);
          showFeedback(message, 'error');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadDevice();
    return () => { active = false; };
  }, [id, showFeedback]);

  return (
    <>
      <Header />
      <Box sx={{ maxWidth: 1240, mx: 'auto', px: { xs: 3, md: 6 }, py: { xs: 4, md: 7 }, minHeight: '65vh' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress color="primary" /></Box>
        ) : error || !device ? (
          <Box sx={{ maxWidth: 960, mx: 'auto', mt: 4 }}>
            <Button onClick={() => navigate('/devices')} startIcon={<ArrowBack />} sx={{ color: 'rgba(244,247,239,.62)' }}>
              Back to devices
            </Button>
          </Box>
        ) : (
          <AddDeviceForm
            device={device}
            onBack={() => navigate('/')}
            onSaved={() => navigate('/')}
            onDeleted={() => navigate('/')}
          />
        )}
      </Box>
      <Footer />
    </>
  );
}
