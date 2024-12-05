import React from 'react';
import { Box, Card, Typography, Avatar, Divider, Grid, IconButton } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import { useLocation } from 'react-router-dom';

const ViewMore = () => {
  const location = useLocation();
  const { name, role, status, img } = location.state || {};
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', p: 3 }}>
      {/* Left Panel */}
      <Card sx={{ p: 3, width: '30%', mr: 3 }}>
        <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }} src="https://via.placeholder.com/80" alt="JWT User" />
        <Typography variant="h6" align="center">
          JWT User
        </Typography>
        <Typography variant="body2" align="center" color="textSecondary">
          UI/UX Designer
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <Typography variant="caption" sx={{ p: 1, border: '1px solid blue', borderRadius: '5px', color: 'blue' }}>
            Pro
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ my: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <EmailIcon sx={{ mr: 1 }} />
            <Typography variant="body2">demo@sample.com</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PhoneIcon sx={{ mr: 1 }} />
            <Typography variant="body2">(+99) 9999 999 999</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOnIcon sx={{ mr: 1 }} />
            <Typography variant="body2">Melbourne</Typography>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
          <Box>
            <Typography variant="h6" align="center">
              37
            </Typography>
            <Typography variant="caption" align="center">
              Mails
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" align="center">
              2749
            </Typography>
            <Typography variant="caption" align="center">
              Followers
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" align="center">
              678
            </Typography>
            <Typography variant="caption" align="center">
              Following
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Right Panel */}
      <Card sx={{ p: 3, width: '70%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">About Me</Typography>
          <IconButton>
            <EditIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="textSecondary" paragraph>
          Hello, I’m Anshan Handgun Creative Graphic Designer & User Experience Designer based in Website, I create digital Products a more
          Beautiful and usable place. Morbid accusant ipsum. Nam nec tellus at.
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6">Personal Details</Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>Full Name:</strong> JWT User
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">{/* <strong>Father's Name:</strong> Mr. Deepen Handgun */}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>Address:</strong> Street 110-B Kalians Bag, Dewan, M.P. INDIA
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>Zip Code:</strong> 12345
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>Phone:</strong> +0 123456789
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>Email:</strong> support@example.com
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>Website:</strong> http://example.com
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default ViewMore;
