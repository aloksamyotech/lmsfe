import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Grid, Menu, MenuItem, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';

// assets
import EarningIcon from 'assets/images/icons/earning.svg';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import GetAppTwoToneIcon from '@mui/icons-material/GetAppOutlined';
import FileCopyTwoToneIcon from '@mui/icons-material/FileCopyOutlined';
import PictureAsPdfTwoToneIcon from '@mui/icons-material/PictureAsPdfOutlined';
import ArchiveTwoToneIcon from '@mui/icons-material/ArchiveOutlined';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import PersonAddIcon from '@mui/icons-material/PersonAdd'; // Updated import for PersonAddIcon
import { url } from 'core/url';
import { getRegisterStudentCount } from 'core/helperFurtion';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  // backgroundColor: theme.palette.primary.dark,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
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

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const EarningCard = ({ isLoading }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [bookCount, setBookCount] = useState(0);

  useEffect(() => {
    const fetchBookCount = async () => {
      try {

        const response = await getRegisterStudentCount(url.studentRegister.getRegisterStudentCount);
        setBookCount(response.data.count);
      } catch (error) {
        console.error('Error fetching book count:', error);
      }
    };

    fetchBookCount();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <CardWrapper border={false} content={false} sx={{ height: '80%' }}>
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container justifyContent="space-between">
                  <Grid item></Grid>
                  <Grid item></Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container alignItems="center">
                  <Grid item sx={{ ml: 1 }}>
                    <PersonAddIcon
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
                </Grid>
              </Grid>
              <Grid item sx={{ mb: 1.25 }}>
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
                  {`Total Students `}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

EarningCard.propTypes = {
  isLoading: PropTypes.bool
};

export default EarningCard;
