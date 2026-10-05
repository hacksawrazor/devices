import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box component="footer" sx={{ maxWidth: 1240, mx: 'auto', px: { xs: 3, md: 6 }, py: 4, display: 'flex', justifyContent: 'space-between', color: 'rgba(244,247,239,.45)', fontSize: '.8rem' }}>
      <Typography variant="body2">© 2026 Hacksaw Studio</Typography>
      <Typography variant="body2">Strategy with an edge.</Typography>
    </Box>
  );
}

