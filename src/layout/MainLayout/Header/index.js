import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Badge, ButtonBase, IconButton } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router';

// assets
import { IconMenu2 } from '@tabler/icons';
import { useCart } from '../../../views/Books/CartContext';

// project imports
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

  // State to hold the current date information
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const today = new Date();

    // Get the day, month, and year
    const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long' });
    const dayOfMonth = today.getDate();
    const month = today.toLocaleString('en-US', { month: 'long' });
    const year = today.getFullYear();

    // Function to add the correct suffix to the day of the month
    const getDaySuffix = (day) => {
      if (day >= 11 && day <= 13) return 'th'; // Special case for 11th, 12th, 13th
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    // Add the suffix to the day
    const dayWithSuffix = `${dayOfMonth}${getDaySuffix(dayOfMonth)}`;

    // Set the formatted date string
    setCurrentDate(`${dayOfWeek} ${dayWithSuffix} ${month} ${year}`);
  }, []); // This runs only once when the component is mounted

  return (
    <>
      {/* logo & toggler button */}
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

      {/* header search */}
      {/* <SearchSection /> */}

      <Box sx={{ flexGrow: 1, paddingLeft: '40px' }}>
        <h2 style={{ marginBottom: 0 }}>Hi, welcome back!</h2>
        <p style={{ marginTop: 0 }}>Don’t forget to smile today :)</p>
      </Box>

      {/* Display today's date */}
      <Box sx={{ flexGrow: 1, marginRight:'30px' }}>
        <p style={{marginBottom:0}}>Today is -</p>
        <h2 style={{marginTop:0}}>{currentDate}</h2> {/* Display the formatted current date */}
      </Box>

      {/* notification & profile */}
      {/* cart section here --------------------------------------------------------------- */}
      <IconButton onClick={handleCartClick}>
        <Badge badgeContent={getCartLength()} color="secondary" invisible={getCartLength() === 0}>
          <ShoppingCartIcon />
        </Badge>
      </IconButton>

      <NotificationSection />
      <ProfileSection />
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func
};

export default Header;
