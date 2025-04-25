import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Divider } from '@mui/material';
import { useParams, useLocation } from 'react-router-dom';
import { Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import { getApi } from 'core/apiClient';
import { url } from 'core/url';
import defaultBook from './bookDummy.jpeg';

const ImageGallery = () => {
  const { id } = useParams();
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const fallbackData = location.state?.rowData;

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await getApi(`${url.bookManagenent.bookData}${id}`);
        setBookData(response?.data?.data);
      } catch (error) {
        console.error('Error fetching book data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBook();
  }, [id]);

  const data = bookData || fallbackData;

  if (loading) return <Typography>Loading...</Typography>;
  if (!data) return <Typography>No book data found.</Typography>;

  return (
    <Box sx={{ padding: 2 }}>
      <Box
        sx={{
          backgroundColor: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          height: '50px',
          width: '97%',
          marginLeft: '2%'
        }}
      >
        <Breadcrumbs separator="/" aria-label="breadcrumb" sx={{ display: 'flex', alignItems: 'center' }}>
          <MuiLink component={Link} to="/dashboard/default" color="inherit">
            <HomeIcon sx={{ color: '#5e35b1' }} />
          </MuiLink>
        </Breadcrumbs>
      </Box>

      <Box sx={{ display: 'flex', padding: 2 }}>
        <Paper
          sx={{
            width: 300,
            marginRight: 2,
            padding: 2,
            backgroundImage: `url(${
              bookData?.upload_Book ? `${url.baseurl.baseurl.replace(/\/$/, '')}/${bookData.upload_Book.replace(/\\/g, '/')}` : defaultBook
            })`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            minHeight: '300px'
          }}
        />

        <Paper sx={{ flex: 1, padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            Book Details
          </Typography>
          <Divider sx={{ marginBottom: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body1" fontWeight="bold">
                Book Name:
              </Typography>
              <Typography variant="body2">{data?.bookName}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" fontWeight="bold">
                Book Title:
              </Typography>
              <Typography variant="body2">{data?.title || 'Fantasy, Adventure'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" fontWeight="bold">
                Author:
              </Typography>
              <Typography variant="body2">{data?.author}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" fontWeight="bold">
                Description:
              </Typography>
              <Typography variant="body2">{data?.bookDistribution || 'No description available.'}</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default ImageGallery;
