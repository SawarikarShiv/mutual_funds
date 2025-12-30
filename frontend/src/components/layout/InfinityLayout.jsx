import React, { useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
  Badge,
  InputBase,
  alpha,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AccountBalance as FundIcon,
  PieChart as PortfolioIcon,
  Receipt as TransactionIcon,
  AutoGraph as SIPIcon,
  Person as ProfileIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Notifications,
  Search,
  Help,
  Chat,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import InfinityMutualFundsLogo from '../branding/InfinityLogo';

const drawerWidth = 280;

const InfinityLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [darkMode, setDarkMode] = useState(false);

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Funds Explorer', icon: <FundIcon />, path: '/funds' },
    { text: 'My Portfolio', icon: <PortfolioIcon />, path: '/portfolio' },
    { text: 'Transactions', icon: <TransactionIcon />, path: '/transactions' },
    { text: 'SIP Plans', icon: <SIPIcon />, path: '/sip' },
    { text: 'My Profile', icon: <ProfileIcon />, path: '/profile' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const notifications = [
    { id: 1, text: 'Your SIP payment of ₹10,000 was successful', time: '2 min ago' },
    { id: 2, text: 'Infinity Bluechip Fund NAV increased by 2.5%', time: '1 hour ago' },
    { id: 3, text: 'New fund launched: Infinity Digital India Fund', time: '3 hours ago' },
    { id: 4, text: 'Market insights: Equity markets show strong growth', time: '1 day ago' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Toolbar sx={{ justifyContent: 'center', py: 3 }}>
        <InfinityMutualFundsLogo size="large" />
      </Toolbar>

      <Divider sx={{ mx: 3 }} />

      {/* User Profile */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 2,
            border: `3px solid ${theme.palette.primary.main}`,
            background: 'linear-gradient(135deg, #1a237e 0%, #00b0ff 100%)',
            fontSize: '2rem',
            fontWeight: 'bold',
          }}
        >
          {user?.firstName?.charAt(0) || 'P'}
        </Avatar>
        <Typography variant="h6" fontWeight={700}>
          {user?.firstName || 'Partner'} {user?.lastName || ''}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.role === 'admin' ? 'Administrator' : 'Financial Advisor'}
        </Typography>
        <Chip
          label="Premium Partner"
          size="small"
          sx={{
            mt: 1,
            background: 'linear-gradient(135deg, #ff6f00 0%, #ffab00 100%)',
            color: 'white',
            fontWeight: 600,
          }}
        />
      </Box>

      <Divider sx={{ mx: 3 }} />

      {/* Menu Items */}
      <List sx={{ flex: 1, px: 2, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            sx={{
              borderRadius: 3,
              mb: 1,
              '&:hover': {
                background: alpha(theme.palette.primary.main, 0.1),
              },
              '&.Mui-selected': {
                background: 'linear-gradient(135deg, #1a237e 0%, #00b0ff 100%)',
                color: 'white',
                '& .MuiListItemIcon-root': {
                  color: 'white',
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          </ListItem>
        ))}
      </List>

      {/* Footer */}
      <Box sx={{ p: 3, pt: 0 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Chat />}
          sx={{ borderRadius: 3, mb: 2 }}
          onClick={() => window.open('https://wa.me/919999999999', '_blank')}
        >
          Chat Support
        </Button>
        <Button
          fullWidth
          variant="contained"
          startIcon={<Help />}
          sx={{
            borderRadius: 3,
            background: 'linear-gradient(135deg, #1a237e 0%, #00b0ff 100%)',
          }}
          onClick={() => navigate('/help')}
        >
          Help Center
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' }, color: 'primary.main' }}
          >
            <MenuIcon />
          </IconButton>

          {/* Search Bar */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              background: alpha(theme.palette.primary.main, 0.05),
              borderRadius: 3,
              px: 2,
              py: 0.5,
              maxWidth: 500,
              mx: { md: 'auto' },
            }}
          >
            <Search sx={{ color: 'text.secondary', mr: 1 }} />
            <InputBase
              placeholder="Search funds, clients, or reports..."
              sx={{ flex: 1 }}
            />
          </Box>

          {/* Right Side Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>

            <IconButton onClick={handleNotificationsOpen}>
              <Badge badgeContent={4} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            <IconButton onClick={handleMenuOpen}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  background: 'linear-gradient(135deg, #1a237e 0%, #00b0ff 100%)',
                }}
              >
                {user?.firstName?.charAt(0) || 'P'}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleNotificationsClose}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 400,
            borderRadius: 3,
            mt: 1,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Notifications
          </Typography>
        </Box>
        <Divider />
        {notifications.map((notification) => (
          <MenuItem key={notification.id} onClick={handleNotificationsClose}>
            <Box sx={{ py: 1 }}>
              <Typography variant="body2">{notification.text}</Typography>
              <Typography variant="caption" color="text.secondary">
                {notification.time}
              </Typography>
            </Box>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={handleNotificationsClose}>
          <Typography variant="body2" color="primary" textAlign="center" sx={{ width: '100%' }}>
            View All Notifications
          </Typography>
        </MenuItem>
      </Menu>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            width: 200,
            borderRadius: 3,
            mt: 1,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" fontWeight={700}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => { handleNavigation('/profile'); handleMenuClose(); }}>
          <ListItemIcon>
            <ProfileIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { handleNavigation('/settings'); handleMenuClose(); }}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          background: theme.palette.background.default,
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default InfinityLayout;