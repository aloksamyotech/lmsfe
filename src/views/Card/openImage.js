import React from 'react';
import { Box, Grid, Paper, Typography, Divider, Breadcrumbs, Link } from '@mui/material';
import { useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home'; 

const ImageGallery = () => {
  const location = useLocation();
  const rowData = location.state?.rowData;
  console.log(`rowData`, rowData);

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
          // marginBottom: '-10px',
          width: '97%',
          marginLeft: '2%'
        }}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Link href="/" underline="hover" color="inherit">
            <HomeIcon sx={{ mr: 0.5, color: '#6a1b9a' }} />
          </Link>
          <Link href="/account-profile" underline="hover" color="inherit">
            <h4> Book Details</h4>
          </Link>
        </Breadcrumbs>
      </Box>
 
      <Box sx={{ display: 'flex', padding: 2 }}>
        <Paper
          sx={{
            width: 300,
            marginRight: 2,
            padding: 2,
            backgroundImage: `url(${rowData?.img?.replace(/\\+/g, '/')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white'
          }}
        >
          <Typography
            variant="h5"
            sx={{
              position: 'absolute',
              bottom: 20,
              left: 20,
              color: 'white',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)'
            }}
          >
            The Adventures of a Dreamer
          </Typography>
        </Paper>
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
              <Typography variant="body2"> {rowData?.name}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" fontWeight="bold">
                Book Title:
              </Typography>
              <Typography variant="body2">Fantasy, Adventure</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" fontWeight="bold">
                Author:
              </Typography>
              <Typography variant="body2">{rowData?.role}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body1" fontWeight="bold">
                Description:
              </Typography>
              <Typography variant="body2">
                The Adventures of a Dreamer is a captivating fantasy novel that follows the journey of a young hero, Elara, as she embarks
                on a quest to uncover the mysteries of a hidden realm. Set in a world where magic is both a blessing and a curse, Elara’s
                journey takes her through enchanted forests, ancient ruins, and into the heart of dark kingdoms. Along the way, she forms
                unlikely alliances and faces challenges that test her courage, loyalty, and strength. Will she be able to save her world
                from a looming dark force, or will the secrets of the dreamers be lost forever?
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default ImageGallery;
