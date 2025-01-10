import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, Button, Grid, Typography } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups'; // Import the GroupsIcon
// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.warning.dark,
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
    background: theme.palette.warning.main,
    borderRadius: '50%',
    top: -125,
    right: -15,
    opacity: 0.5,
    [theme.breakpoints.down('sm')]: {
      top: -155,
      right: -70
    }
  }
}));

// ==============================|| DASHBOARD - TOTAL ORDER LINE CHART CARD ||============================== //

const TotalOrderLineChartCardd = ({ isLoading }) => {
  const theme = useTheme();

  const [bookCount, setBookCount] = useState(0);
  const [timeValue, setTimeValue] = useState(false);
  const handleChangeTime = (event, newValue) => {
    setTimeValue(newValue);
  };

  useEffect(() => {
    const fetchBookCount = async () => {
      try {
        const response = await axios.get('http://64.227.130.216:4300/user/getVenderCount');
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
        <CardWrapper border={false} content={false}>
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
                    <GroupsIcon sx={{ fontSize: 35, verticalAlign: 'middle', marginRight: 1 }} />
                  </Grid>
                  <Grid item>
                    <Typography sx={{ fontSize: '1.825rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>{bookCount}</Typography>
                  </Grid>

                  <Grid item></Grid>
                  <Grid item xs={12}>
                    <Typography
                      sx={{
                        fontSize: '1.525rem',
                        fontWeight: 500,
                        mr: 1,
                        mt: 1.75,
                        mb: 0.75
                      }}
                    >
                      {`Total Vendors  `}
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

TotalOrderLineChartCardd.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalOrderLineChartCardd;
