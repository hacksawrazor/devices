import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AddDeviceForm from '../components/AddDeviceForm';

export default function AddDevicePage() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <Box sx={{ maxWidth: 1240, mx: 'auto', px: { xs: 3, md: 6 }, py: { xs: 4, md: 7 }, minHeight: '65vh' }}>
        <AddDeviceForm onBack={() => navigate('/')} onSaved={() => navigate('/')} />
      </Box>
      <Footer />
    </>
  );
}
