import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';

// material-ui
import { useTheme } from '@mui/material/styles';
import { CardContent, Divider, Grid, Menu, MenuItem, Typography } from '@mui/material';

// project imports
import BajajAreaChartCard from './BajajAreaChartCard';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonPopularCard from 'ui-component/cards/Skeleton/PopularCard';
import { gridSpacing } from 'store/constant';

// assets
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import { getApi } from 'core/apiClient';
import { url } from 'core/url';

const PopularCard = ({ isLoading }) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const [products, setProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]); // optional if you use restock

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Fetch top 5 trending books
  useEffect(() => {
    const fetchTrendingBooks = async () => {
      try {
        const response = await getApi(url.allotmentManagement.trendingBooks);
        if (response.data.success) {
          setProducts(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching trending books:', error);
      }
    };

    fetchTrendingBooks();
  }, []);

  return (
    <>
      <MainCard content={false}>
        <CardContent>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container alignContent="center" justifyContent="space-between">
                <Grid item>
                  <Typography variant="h4" sx={{ paddingTop: '5px' }}>
                    Popular Books
                  </Typography>
                </Grid>
                <Grid item>
                  <MoreHorizOutlinedIcon
                    fontSize="small"
                    sx={{
                      color: theme.palette.primary[200],
                      cursor: 'pointer'
                    }}
                    aria-controls="menu-popular-card"
                    aria-haspopup="true"
                    onClick={handleClick}
                  />
                  <Menu
                    id="menu-popular-card"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    variant="selectedMenu"
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right'
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right'
                    }}
                  >
                    <MenuItem onClick={handleClose}> Today</MenuItem>
                    <MenuItem onClick={handleClose}> This Month</MenuItem>
                    <MenuItem onClick={handleClose}> This Year </MenuItem>
                  </Menu>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sx={{ pt: '16px !important' }}>
              <BajajAreaChartCard />
            </Grid>

            <Grid item xs={12}>
              {products.length > 0 ? (
                products.map((book, index) => (
                  <Grid container key={index} sx={{ marginBottom: 1 }} justifyContent="space-between">
                    <Grid item xs={6}>
                      <Typography variant="body2" color="inherit">
                        {book.title}
                      </Typography>
                      <Divider sx={{ marginY: 1.5, borderWidth: 0.001 }} />
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                      <Typography variant="subtitle1" color="inherit">
                        {book.quantity}
                      </Typography>
                    </Grid>
                  </Grid>
                ))
              ) : (
                <Typography variant="h6" color="inherit" sx={{ textAlign: 'center', marginY: 2 }}>
                  No Book available.
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </MainCard>
    </>
  );
};

PopularCard.propTypes = {
  isLoading: PropTypes.bool
};

export default PopularCard;
