import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
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
  Tune 
} from '@mui/icons-material';

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
    button: { fontWeight: 600, textTransform: 'none' }
  },
  shape: {
    borderRadius: 2,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 2,
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 8px 24px rgba(184, 243, 74, 0.2)' }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          }
        }
      }
    }
  }
});

function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Create floating geometric particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1200;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 80;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.15,
      color: '#60a5fa',
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Mouse movement interaction
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) - 0.5;
      mouseY = (event.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      particlesMesh.rotation.y += 0.0008;
      particlesMesh.rotation.x += 0.0004;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <Box ref={mountRef} sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }} />;
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', bgcolor: '#101312', color: '#f4f7ef' }}>
        <ThreeBackground />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box component="header" sx={{ maxWidth: 1240, mx: 'auto', px: { xs: 3, md: 6 }, py: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="#top" underline="none" sx={{ display: 'flex', alignItems: 'center', gap: 1.2, color: '#f4f7ef' }}>
              <AutoAwesome sx={{ color: '#b8f34a' }} />
              <Typography sx={{ fontWeight: 700, fontSize: '1.2rem' }}>Hacksaw</Typography>
            </Link>
            <Box component="nav" sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
              <Link href="#approach" sx={{ color: 'rgba(244,247,239,.7)', textDecoration: 'none' }}>Approach</Link>
              <Link href="#signal" sx={{ color: 'rgba(244,247,239,.7)', textDecoration: 'none' }}>Signal</Link>
              <Link href="#contact" sx={{ color: 'rgba(244,247,239,.7)', textDecoration: 'none' }}>Contact</Link>
            </Box>
            <Button href="#contact" variant="outlined" endIcon={<ArrowOutward />} sx={{ borderColor: 'rgba(244,247,239,.35)', color: '#f4f7ef', px: 2.5 }}>Start a project</Button>
          </Box>

          <Box component="main" id="top">
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

            <Box id="signal" sx={{ maxWidth: 1240, mx: 'auto', px: { xs: 3, md: 6 }, py: { xs: 10, md: 16 } }}><Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', mb: 6, gap: 3 }}><Box><Typography sx={{ color: '#b8f34a', fontSize: '.78rem', letterSpacing: '.16em', textTransform: 'uppercase', fontWeight: 700, mb: 2 }}>Why Hacksaw</Typography><Typography variant="h3" sx={{ fontSize: { xs: '2rem', md: '3.2rem' } }}>Built for the bold.</Typography></Box><Insights sx={{ display: { xs: 'none', sm: 'block' }, color: '#62d8ff', fontSize: 48 }} /></Box><Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
              {[{ icon: <Tune />, title: 'Sharp thinking', text: 'A point of view that keeps your product focused and distinct.' }, { icon: <Bolt />, title: 'Fast by design', text: 'Small teams, direct communication, and progress you can see.' }, { icon: <Insights />, title: 'Useful outcomes', text: 'Work that creates traction long after the launch moment.' }].map(({ icon, title, text }) => <Box key={title} sx={{ p: { xs: 3, md: 4 }, minHeight: 220, bgcolor: 'rgba(244,247,239,.06)', border: '1px solid rgba(244,247,239,.12)' }}><Box sx={{ color: '#b8f34a', mb: 7 }}>{icon}</Box><Typography variant="h6" sx={{ mb: 1 }}>{title}</Typography><Typography sx={{ color: 'rgba(244,247,239,.58)', lineHeight: 1.5 }}>{text}</Typography></Box>)}
            </Box></Box>

            <Box id="contact" sx={{ bgcolor: '#b8f34a', color: '#101312', px: { xs: 3, md: 6 }, py: { xs: 9, md: 13 } }}><Box sx={{ maxWidth: 1240, mx: 'auto', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'start', md: 'end' }, gap: 5 }}><Typography variant="h3" sx={{ fontSize: { xs: '2.6rem', md: '4.5rem' }, maxWidth: 700 }}>Have a sharp idea? Let’s make it real.</Typography><Button href="mailto:hello@hacksaw.studio" variant="contained" endIcon={<ArrowOutward />} sx={{ bgcolor: '#101312', color: '#f4f7ef', px: 3, py: 1.5, whiteSpace: 'nowrap' }}>hello@hacksaw.studio</Button></Box></Box>
          </Box>
          <Box component="footer" sx={{ maxWidth: 1240, mx: 'auto', px: { xs: 3, md: 6 }, py: 4, display: 'flex', justifyContent: 'space-between', color: 'rgba(244,247,239,.45)', fontSize: '.8rem' }}><Typography variant="body2">© 2026 Hacksaw Studio</Typography><Typography variant="body2">Strategy with an edge.</Typography></Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}