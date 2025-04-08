import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';
// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, Grid, Typography } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook'; // Import the MenuBookIcon

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';
import { url } from 'core/url';
import { getBookCount } from 'core/helperFurtion';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  // backgroundColor: theme.palette.error.dark, // Change the background color
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  '&>div': {
    position: 'relative',
    zIndex: 5
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    zIndex: 1,
    width: 210,
    height: 210,
    background: 'linear-gradient(140.9deg, rgb(255, 193, 7) -14.02%, rgba(144, 202, 249, 0) 70.5%)',
    borderRadius: '50%',
    top: -160,
    right: -130,
    opacity: 0.5,
    [theme.breakpoints.down('sm')]: {
      top: -155,
      right: -70
    }
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    zIndex: 1,
    width: 210,
    height: 210,
    background: 'linear-gradient(140.9deg, rgb(255, 193, 7) -14.02%, rgba(144, 202, 249, 0) 70.5%)',
    borderRadius: '50%',
    top: -30,
    right: -180
  }
}));

// ==============================|| DASHBOARD - TOTAL ORDER LINE CHART CARD ||============================== //

const TotalOrderLineChartCard = ({ isLoading }) => {
  const theme = useTheme();

  const [bookCount, setBookCount] = useState(0);
  const [timeValue, setTimeValue] = useState(false);

  const handleChangeTime = (event, newValue) => {
    setTimeValue(newValue);
  };

  useEffect(() => {
    const fetchBookCount = async () => {
      try {

        const response = await getBookCount(url.bookManagenent.bookCount);
        console.log('API Response:', response.data);
        setBookCount(response.data.count);
      } catch (error) {
        console.error('Error fetching book count:', error);
      }
    };

    fetchBookCount();
  }, []);

  return (
    <>
      {isLoading ? (
        <SkeletonTotalOrderCard />
      ) : (
        <CardWrapper border={false} content={false} sx={{height: '80%'}}>
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between">
                  <Grid item></Grid>
                </Grid>
              </Grid>
              <Grid item sx={{ mb: 0.75 }}>
                <Grid container alignItems="center">
                  <Grid item sx={{ ml: 1 }}>
                    <MenuBookIcon
                      sx={{
                        fontSize: 45,
                        verticalAlign: 'middle',
                        marginRight: 1,
                        color: 'rgb(255, 193, 7)',
                        background: 'rgb(255, 248, 225)',
                        borderRadius: '50%',
                        padding: 1
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Typography sx={{ fontSize: '1.825rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75, color: 'black' }}>
                      {bookCount}
                    </Typography>
                  </Grid>
                  {/* Add the MenuBookIcon next to the book count */}

                  <Grid item xs={12}>
                    <Typography
                      sx={{
                        fontSize: '1.200rem',
                        fontWeight: 500,
                        mr: 1,
                        mt: 1.75,
                        mb: 0.75,
                        color: 'black'
                      }}
                    >
                      {`Total Books`}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

TotalOrderLineChartCard.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalOrderLineChartCard;
