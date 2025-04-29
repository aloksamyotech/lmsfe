import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Badge, ButtonBase, IconButton ,Typography} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router';
import { IconMenu2 } from '@tabler/icons';
import { useCart } from '../../../views/Books/CartContext';
import LogoSection from '../LogoSection';
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { getCartLength } = useCart();
  const handleCartClick = () => {
    navigate('dashboard/cart');
  };

  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const today = new Date();

    const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long' });
    const dayOfMonth = today.getDate();
    const month = today.toLocaleString('en-US', { month: 'long' });
    const year = today.getFullYear();

    const getDaySuffix = (day) => {
      if (day >= 11 && day <= 13) return 'th';
      switch (day % 10) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
        default:
          return 'th';
      }
    };

    const dayWithSuffix = `${dayOfMonth}${getDaySuffix(dayOfMonth)}`;

    setCurrentDate(`${dayOfWeek} ${dayWithSuffix} ${month} ${year}`);
  }, []);

  return (
    <>
      <Box
        sx={{
          width: 228,
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            width: 'auto'
          }
        }}
      >
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>
        <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: 'all .2s ease-in-out',
              background: theme.palette.secondary.light,
              color: theme.palette.secondary.dark,
              '&:hover': {
                background: theme.palette.secondary.dark,
                color: theme.palette.secondary.light
              }
            }}
            onClick={handleLeftDrawerToggle}
            color="inherit"
          >
            <IconMenu2 stroke={1.5} size="1.3rem" />
          </Avatar>
        </ButtonBase>
      </Box>
      <Box sx={{ flexGrow: 1, pl: 5 }}>
        <Typography variant="h2" sx={{ mb: 0 }}>
          Hi, welcome back!
        </Typography>
        <Typography variant="body1" sx={{ mt: 0 }}>
          Don’t forget to smile today :)
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, mr: 4 }}>
        <Typography variant="body2" sx={{ mb: 0 }}>
          Today is -
        </Typography>
        <Typography variant="h2" sx={{ mt: 0 }}>
          {currentDate}
        </Typography>
      </Box>
      <IconButton onClick={handleCartClick}>
        <Badge badgeContent={getCartLength()} color="secondary" invisible={getCartLength() === 0}>
          <ShoppingCartIcon />
        </Badge>
      </IconButton>

      <ProfileSection />
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func
};

export default Header;
