import { Logout } from '@mui/icons-material';
import { AppBar, Box, styled, Toolbar, Typography, Switch, FormControlLabel, Tooltip, IconButton, Avatar, Menu, MenuItem } from '@mui/material'
import React, { useState } from 'react'
import { logoutUser } from '../services/EventService';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png";

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#aab4be',
        ...theme.applyStyles('dark', {
          backgroundColor: '#8796A5',
        }),
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#001e3c',
    width: 32,
    height: 32,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
    ...theme.applyStyles('dark', {
      backgroundColor: '#003892',
    }),
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#aab4be',
    borderRadius: 20 / 2,
    ...theme.applyStyles('dark', {
      backgroundColor: '#8796A5',
    }),
  },
}));

const Navbar = ({mode, setMode}) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const token = JSON.parse(window.sessionStorage.getItem('tokens')).access_token;
      await logoutUser(token);
      window.sessionStorage.clear();
      window.localStorage.clear();
      setIsLoading(false);
      handleCloseUserMenu();
      navigate('/login');
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color='white'>
        <Toolbar>
          <Box sx={{flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1}}> 
            <Avatar alt="logo" src={logo} />
            <Typography variant="h6" color={mode === 'light' ? 'primary' : 'none'} fontFamily={'Poppins'} component="div" sx={{ fontWeight: 800, cursor: 'pointer' }}>
              Daily Dots
            </Typography>
          </Box>
          <FormControlLabel
            control={<MaterialUISwitch checked={mode === 'dark'} onChange={() => setMode(prev => prev === 'light' ? 'dark' : 'light')}/>}
            label=""
          />
          <Box>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu}>
                <Avatar alt="user_picture" src={userInfo?.picture} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            > 
              <MenuItem sx={{borderBottom: '2px solid #0D92F4', mb: 2}}>
                <Typography sx={{ textAlign: 'center' }}>User: {userInfo?.name}</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout} disabled={isLoading}>
                <Logout sx={{ marginRight: 1 }} fontSize='small'/>
                <Typography sx={{ textAlign: 'center' }}>{isLoading ? 'Please Wait...' : 'Logout'}</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar