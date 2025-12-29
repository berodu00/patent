import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Container,
    ListItemButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Patents', icon: <DescriptionIcon />, path: '/patents' },
    ];

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => setOpen(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Patent Management System
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
                <Box
                    sx={{ width: 250 }}
                    role="presentation"
                    onClick={() => setOpen(false)}
                    onKeyDown={() => setOpen(false)}
                >
                    <List>
                        {menuItems.map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton
                                    onClick={() => navigate(item.path)}
                                    selected={location.pathname === item.path}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Outlet />
            </Container>
        </Box>
    );
};

export default Layout;
