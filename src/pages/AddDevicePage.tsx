import { ArrowBack } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AddDeviceForm from '../components/AddDeviceForm';

export default function AddDevicePage() {
  return (
    <Box sx={{ maxWidth: 1240, mx: 'auto', px: { xs: 3, md: 6 }, py: { xs: 4, md: 7 }, minHeight: '65vh' }}>
      <Button component={RouterLink} to="/devices" startIcon={<ArrowBack />} sx={{ color: 'rgba(244,247,239,.72)', mb: 2, px: 0 }}>
        Back to devices
      </Button>
      <AddDeviceForm />
    </Box>
  );
}
