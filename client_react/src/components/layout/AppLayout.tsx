import { useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Collapse,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  PersonSearch,
  People,
  Business,
  VideoLibrary,
  ToggleOn,
  Backup,
  CloudUpload,
  Restore,
  Logout,
  BarChart,
  Settings,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { logout } from '../../store/authSlice';
import authService from '../../services/authService';

interface MenuItem {
  path: string;
  label: string;
  icon: ReactNode;
  adminOnly?: boolean;
  superadminOnly?: boolean;
  children?: MenuItem[];
}

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [backupOpen, setBackupOpen] = useState(false);

  const menuItems: MenuItem[] = [
    {
      path: '/dashboard',
      label: 'דשבורד',
      icon: <Dashboard />,
      children: [
        { path: '/dashboard/charts', label: 'גרפים', icon: <BarChart /> },
        { path: '/dashboard/misc', label: 'שונות', icon: <Settings /> },
      ],
    },
    { path: '/leads', label: 'לידים', icon: <PersonSearch /> },
    { path: '/customers', label: 'לקוחות', icon: <People /> },
    { path: '/suppliers', label: 'ספקים', icon: <Business /> },
    { path: '/projects', label: 'פרויקטים', icon: <VideoLibrary /> },
    { path: '/statuses', label: 'סטטוסים', icon: <ToggleOn />, adminOnly: true },
    {
      path: '/backup',
      label: 'גיבויים',
      icon: <Backup />,
      superadminOnly: true,
      children: [
        { path: '/backup', label: 'ניהול גיבויים', icon: <CloudUpload /> },
        { path: '/backup/restore', label: 'שחזור גיבוי', icon: <Restore /> },
      ],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.superadminOnly) {
      return user?.role === 'superadmin';
    }
    if (item.adminOnly) {
      return authService.isAdmin();
    }
    return true;
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {filteredMenuItems.map((item) => (
          <Box key={item.path}>
            {item.children ? (
              <>
                <ListItemButton
                  onClick={() => {
                    if (item.label === 'דשבורד') setDashboardOpen(!dashboardOpen);
                    if (item.label === 'גיבויים') setBackupOpen(!backupOpen);
                  }}
                  sx={{
                    mx: 1,
                    mb: 0.5,
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                  {item.label === 'דשבורד' ? (
                    dashboardOpen ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )
                  ) : backupOpen ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                </ListItemButton>
                <Collapse
                  in={item.label === 'דשבורד' ? dashboardOpen : backupOpen}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.children.map((child) => (
                      <ListItemButton
                        key={child.path}
                        component={RouterLink}
                        to={child.path}
                        onClick={() => isMobile && setMobileOpen(false)}
                        selected={isActive(child.path)}
                        sx={{
                          mx: 1,
                          mb: 0.5,
                          mr: 3,
                          borderRadius: 2,
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(139, 92, 246, 0.2)',
                            '&:hover': {
                              backgroundColor: 'rgba(139, 92, 246, 0.3)',
                            },
                          },
                          '&:hover': {
                            backgroundColor: 'rgba(139, 92, 246, 0.1)',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ color: 'white' }}>{child.icon}</ListItemIcon>
                        <ListItemText primary={child.label} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItemButton
                component={RouterLink}
                to={item.path}
                onClick={() => isMobile && setMobileOpen(false)}
                selected={isActive(item.path)}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(139, 92, 246, 0.3)',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            )}
          </Box>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(90deg, #a78bfa 0%, #8b5cf6 100%)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            מנהל וידאו
          </Typography>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2">שלום {user.username}</Typography>
              <IconButton color="inherit" onClick={handleLogout}>
                <Logout />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: 250 }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 250,
              backgroundColor: 'rgba(26, 26, 46, 0.95)',
              color: 'white',
              borderLeft: '1px solid rgba(139, 92, 246, 0.3)',
            },
          }}
        >
          <Toolbar />
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - 250px)` },
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          color: 'white',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};
