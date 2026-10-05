import { useState, type ReactNode } from 'react';
import { Box, Typography, Button, Link, Avatar, Tooltip, Menu, IconButton, MenuItem, ListSubheader } from '@mui/material';
import { AutoAwesome, ArrowOutward, AccountCircle, Logout } from '@mui/icons-material';
import { Link as RouterLink, useInRouterContext } from 'react-router-dom';
import { urls } from '../config/urls';
import { getLoginUrl } from '../utils/getLoginUrl';
import { isAuthenticated, type AuthenticatedUser } from '../utils/isAuthenticated';
import { getDevelopmentUser, isDevelopmentAuthEnabled } from '../../dev/developmentAuth';
import { useAuth } from './authContext';

export interface HeaderProps {
  userInfo?: AuthenticatedUser | null;
  developmentAuthEnabled?: boolean;
  onDevSignIn?: () => void;
  onDevSignOut?: () => void;
  setUserInfo?: (user: AuthenticatedUser | null) => void;
}

function HeaderLink({ to, underline, sx, children }: { to: string; underline?: 'none' | 'hover' | 'always'; sx?: object; children: ReactNode }) {
  const inRouter = useInRouterContext();
  if (inRouter) {
    return (
      <Link component={RouterLink} to={to} underline={underline} sx={sx}>
        {children}
      </Link>
    );
  }
  return (
    <Link href={to} underline={underline} sx={sx}>
      {children}
    </Link>
  );
}

export default function Header(props?: HeaderProps) {
  const auth = useAuth();
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<HTMLElement | null>(null);
  const [avatarMenuAnchor, setAvatarMenuAnchor] = useState<HTMLElement | null>(null);

  const userInfo = props?.userInfo !== undefined ? props.userInfo : auth.userInfo;
  const developmentAuthEnabled = props?.developmentAuthEnabled !== undefined
    ? props.developmentAuthEnabled
    : (auth.developmentAuthEnabled ?? isDevelopmentAuthEnabled());
  const userEmail = userInfo?.email ?? null;

  const handleDevSignIn = () => {
    if (props?.onDevSignIn) {
      props.onDevSignIn();
    } else if (props?.setUserInfo) {
      props.setUserInfo(getDevelopmentUser());
    } else if (auth.onDevSignIn) {
      auth.onDevSignIn();
    } else {
      auth.setUserInfo(getDevelopmentUser());
    }
  };

  const handleDevSignOut = () => {
    if (props?.onDevSignOut) {
      props.onDevSignOut();
    } else if (props?.setUserInfo) {
      props.setUserInfo(null);
    } else if (auth.onDevSignOut) {
      auth.onDevSignOut();
    } else {
      auth.setUserInfo(null);
    }
  };

  return (
    <Box component="header" sx={{ maxWidth: 1240, mx: 'auto', px: { xs: 3, md: 6 }, py: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <HeaderLink to="/" underline="none" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.2, color: '#f4f7ef' }}>
        <AutoAwesome sx={{ color: '#b8f34a' }} />
        <Typography sx={{ fontWeight: 700, fontSize: '1.2rem' }}>Hacksaw</Typography>
      </HeaderLink>
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
      <Menu
        id="mobile-navigation-menu"
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={() => setMobileMenuAnchor(null)}
        slotProps={{ paper: { sx: { minWidth: 200, bgcolor: '#181d1b', border: '1px solid rgba(244,247,239,.14)' } } }}
      >
      </Menu>
      {isAuthenticated(userInfo) ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, position: 'relative' }}>
          <Tooltip title={userEmail} arrow>
            <IconButton
              aria-label="account menu"
              onClick={(event) => setAvatarMenuAnchor(event.currentTarget)}
              sx={{ p: 0 }}
            >
              <Avatar
                aria-label={`Signed in as ${userEmail}`}
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: avatarMenuAnchor ? '#d4ff6a' : '#b8f34a',
                  color: '#101312',
                  fontSize: '.85rem',
                  fontWeight: 700,
                  cursor: 'default',
                  transition: 'background-color 0.2s',
                  boxShadow: avatarMenuAnchor ? '0 0 8px rgba(184,243,74,0.5)' : 'none'
                }}
              >
                {(userEmail || '').replace(/[^a-z0-9]/gi, '').slice(0, 2).toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>

        </Box>
        <Menu
          id="avatar-menu"
          anchorEl={avatarMenuAnchor}
          open={Boolean(avatarMenuAnchor)}
          onClose={() => setAvatarMenuAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          slotProps={{ paper: { sx: { minWidth: 150, bgcolor: '#181d1b', border: '1px solid rgba(244,247,239,.14)', marginTop: 1 } } }}
        >
          <ListSubheader sx={{ backgroundColor: 'inherit', display: 'flex', alignItems: 'center'}} >
            <AccountCircle sx={{ mr: 1, color: '#b8f34a' }} />
            {userEmail}
          </ListSubheader>
          <MenuItem component="a" href={urls.home} onClick={() => setAvatarMenuAnchor(null)}>
            <AutoAwesome sx={{ mr: 1, color: '#b8f34a' }} />
            Home
          </MenuItem>
          {developmentAuthEnabled ? (
            <MenuItem
              onClick={() => {
                handleDevSignOut();
                setAvatarMenuAnchor(null);
              }}
            >
              <Logout sx={{ mr: 1, color: '#b8f34a' }} />
              Sign out (dev)
            </MenuItem>
          ) : (
            <MenuItem component="a" href={urls.logout} onClick={() => setAvatarMenuAnchor(null)}>
              <Logout sx={{ mr: 1, color: '#b8f34a' }} />
              Logout
            </MenuItem>
          )}
        </Menu>
        </Box>
      ) : (
        developmentAuthEnabled ? (
          <Button
            onClick={handleDevSignIn}
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
  );
}
