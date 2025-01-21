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
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { url } from 'core/url';
import { getPublicationsCount } from 'core/helperFurtion';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.dark,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',

  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: theme.palette.secondary[800],
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

// ===========================|| DASHBOARD DEFAULT - EARNING CARD ||=========================== //

const EarningCardd = ({ isLoading }) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const [bookCount, setBookCount] = useState(0);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchBookCount = async () => {
      try {
        // const response = await axios.get('http://localhost:4300/user/getPublicationsCount');

        const response = await getPublicationsCount(url.publications.getPublicationsCount);
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
        <SkeletonEarningCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 1.45 }}>
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
                    <GroupAddIcon sx={{ fontSize: 35, verticalAlign: 'middle', marginRight: 1 }} />
                  </Grid>
                  <Grid item>
                    <Typography sx={{ fontSize: '1.825rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>{bookCount}</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sx={{ mb: 1.25 }}>
                <Typography
                  sx={{
                    fontSize: '1.40rem',
                    fontWeight: 500,
                    mr: 1,
                    mt: 1.75,
                    mb: 0.55
                  }}
                >
                  {`Total Publications `}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

EarningCardd.propTypes = {
  isLoading: PropTypes.bool
};

export default EarningCardd;
