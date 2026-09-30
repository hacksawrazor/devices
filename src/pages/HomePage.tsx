import {
  Box,
  Typography,
  Button,
  Link,
} from '@mui/material';
import {
  AutoAwesome,
  ArrowOutward,
  Bolt,
  Insights,
  Tune,
} from '@mui/icons-material';
import { urls } from '../config/urls';

export default function HomePage() {
  return (
    <>
      <Box sx={{ maxWidth: 1240, mx: 'auto', px: { xs: 3, md: 6 }, pt: { xs: 8, md: 14 }, pb: { xs: 12, md: 18 }, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.05fr .95fr' }, gap: { xs: 7, md: 10 }, alignItems: 'center' }}>
        <Box>
          <Typography sx={{ color: '#b8f34a', fontSize: '.78rem', letterSpacing: '.16em', textTransform: 'uppercase', fontWeight: 700, mb: 3 }}>Independent digital studio</Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: '3.5rem', md: '6.2rem' }, lineHeight: .94, maxWidth: 760, mb: 4 }}>Make the next move <Box component="span" sx={{ color: '#62d8ff' }}>obvious.</Box></Typography>
          <Typography sx={{ maxWidth: 540, color: 'rgba(244,247,239,.68)', fontSize: { xs: '1.05rem', md: '1.25rem' }, lineHeight: 1.6, mb: 5 }}>Hacksaw turns ambitious ideas into sharp digital products that people understand, use, and remember.</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button href="#approach" variant="contained" endIcon={<ArrowOutward />} sx={{ bgcolor: '#b8f34a', color: '#101312', px: 3, py: 1.5 }}>See our approach</Button>
            <Button href="#signal" variant="text" sx={{ color: '#f4f7ef', px: 2, py: 1.5 }}>Explore the signal</Button>
          </Box>
        </Box>
        <Box sx={{ minHeight: { xs: 300, md: 460 }, border: '1px solid rgba(244,247,239,.18)', bgcolor: 'rgba(20,27,24,.64)', p: { xs: 3, md: 5 }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 24px 80px rgba(0,0,0,.3)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><Typography sx={{ color: '#62d8ff', fontSize: '.75rem', letterSpacing: '.12em', textTransform: 'uppercase' }}>The workbench</Typography><Bolt sx={{ color: '#b8f34a' }} /></Box>
          <Box sx={{ py: 5 }}><Typography sx={{ fontSize: { xs: '2.3rem', md: '3.5rem' }, fontWeight: 700, lineHeight: 1 }}>Clarity is a<br /><Box component="span" sx={{ color: '#b8f34a' }}>competitive edge.</Box></Typography></Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(244,247,239,.18)', pt: 2 }}><Typography sx={{ color: 'rgba(244,247,239,.58)', fontSize: '.85rem' }}>Strategy / Design / Build</Typography><Typography sx={{ color: '#f4f7ef', fontSize: '.85rem' }}>01 — 03</Typography></Box>
        </Box>
      </Box>

      <Box id="approach" sx={{ borderTop: '1px solid rgba(244,247,239,.14)', borderBottom: '1px solid rgba(244,247,239,.14)' }}>
        <Box sx={{ maxWidth: 1240, mx: 'auto', px: { xs: 3, md: 6 }, py: { xs: 9, md: 13 }, display: 'grid', gridTemplateColumns: { xs: '1fr', md: ' .7fr 1.3fr' }, gap: { xs: 5, md: 12 } }}>
          <Typography sx={{ color: '#b8f34a', fontSize: '.78rem', letterSpacing: '.16em', textTransform: 'uppercase', fontWeight: 700 }}>Our approach</Typography>
          <Box><Typography variant="h3" sx={{ fontSize: { xs: '2rem', md: '3.2rem' }, maxWidth: 700, mb: 7 }}>Less noise. More momentum. Every decision earns its place.</Typography><Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 4 }}>
            {[['01', 'Find the signal', 'We make the complex simple and find the idea worth building.'], ['02', 'Shape the system', 'We give the idea a clear, flexible form built for real people.'], ['03', 'Ship with intent', 'We move from first sketch to useful, measurable momentum.']].map(([number, title, description]) => <Box key={number} sx={{ borderTop: '2px solid #62d8ff', pt: 2 }}><Typography sx={{ color: '#62d8ff', mb: 3 }}>{number}</Typography><Typography sx={{ fontWeight: 700, mb: 1.5 }}>{title}</Typography><Typography sx={{ color: 'rgba(244,247,239,.58)', lineHeight: 1.5 }}>{description}</Typography></Box>)}
          </Box></Box>
        </Box>
      </Box>

      <Box id="signal" sx={{ maxWidth: 1240, mx: 'auto', px: { xs: 3, md: 6 }, py: { xs: 10, md: 16 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', mb: 6, gap: 3 }}>
          <Box>
            <Typography sx={{ color: '#b8f34a', fontSize: '.78rem', letterSpacing: '.16em', textTransform: 'uppercase', fontWeight: 700, mb: 2 }}>Why Hacksaw</Typography>
            <Typography variant="h3" sx={{ fontSize: { xs: '2rem', md: '3.2rem' } }}>Built for the bold.</Typography>
          </Box>
          <Insights sx={{ display: { xs: 'none', sm: 'block' }, color: '#62d8ff', fontSize: 48 }} />
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
          {[{ icon: <Tune />, title: 'Sharp thinking', text: 'A point of view that keeps your product focused and distinct.' }, { icon: <Bolt />, title: 'Fast by design', text: 'Small teams, direct communication, and progress you can see.' }, { icon: <Insights />, title: 'Useful outcomes', text: 'Work that creates traction long after the launch moment.' }].map(({ icon, title, text }) => (
            <Box key={title} sx={{ p: { xs: 3, md: 4 }, minHeight: 220, bgcolor: 'rgba(244,247,239,.06)', border: '1px solid rgba(244,247,239,.12)' }}>
              <Box sx={{ color: '#b8f34a', mb: 7 }}>{icon}</Box>
              <Typography variant="h6" sx={{ mb: 1 }}>{title}</Typography>
              <Typography sx={{ color: 'rgba(244,247,239,.58)', lineHeight: 1.5 }}>{text}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box id="contact" sx={{ bgcolor: '#b8f34a', color: '#101312', px: { xs: 3, md: 6 }, py: { xs: 9, md: 13 } }}>
        <Box sx={{ maxWidth: 1240, mx: 'auto', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'start', md: 'end' }, gap: 5 }}>
          <Typography variant="h3" sx={{ fontSize: { xs: '2.6rem', md: '4.5rem' }, maxWidth: 700 }}>Have a sharp idea? Let’s make it real.</Typography>
          <Button href={urls.contactEmail} variant="contained" endIcon={<ArrowOutward />} sx={{ bgcolor: '#101312', color: '#f4f7ef', px: 3, py: 1.5, whiteSpace: 'nowrap' }}>hello@hacksaw.studio</Button>
        </Box>
      </Box>
    </>
  );
}
