import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Avatar, Typography, Grid, Container, Paper, Link, Breadcrumbs } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import axios from 'axios';

const View = () => {
  const [formData, setFormData] = useState({
    student_Name: '',
    mobile_Number: '',
    email: '',
    register_Date: '',
    select_identity: '',
    address: ' '
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Form Data Submitted:', formData);
  };

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    console.log('Breadcrumb clicked');
  };

  //   const [studentId, setStudentId] = useState<string | null>(null);
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    const url = window.location.href;
    const parts = url.split('/');
    const extractedId = parts[parts.length - 1];
    setStudentId(extractedId);

    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`http://localhost:4300/user/profilePage`);
        console.log('response--------', response);

        if (response.data.status) {
          setFormData({
            student_Name: response.data.students[0].student_Name,
            mobile_Number: response.data.students[0].mobile_Number,
            email: response.data.students[0].email,
            register_Date: response.data.students[0].register_Date,
            select_identity: response.data.students[0].select_identity,
            siteInfo: response.data.students[0].siteInfo
          });
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    if (extractedId) {
      fetchProfileData();
    }
  }, []);

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          height: '50px',
          marginBottom: '-10px',
          width: '73%',
          marginLeft: '5%'
        }}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Link href="/" underline="hover" color="inherit" onClick={handleClick} sx={{ display: 'flex', alignItems: 'center' }}>
            <HomeIcon sx={{ mr: 0.5, color: '#6a1b9a' }} />
          </Link>
          <Link href="/account-profile" underline="hover" color="inherit" onClick={handleClick}>
            <h4> Account Profile</h4>
          </Link>
        </Breadcrumbs>
      </Box>
      <Container>
        <Paper
          elevation={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            maxWidth: '800px',
            margin: 'auto',
            boxShadow: 3,
            borderRadius: '10px',
            marginTop: '30px',
            marginLeft: '30px'
          }}
        >
          <Avatar src="profile.logoUrl" alt="Profile" sx={{ width: 100, height: 100, mb: 2 }} />
          <Typography variant="caption" color="textSecondary"></Typography>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <TextField fullWidth label="Full Name" name="student_Name" value={formData.student_Name} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Phone Number" name="mobile_Number" value={formData.mobile_Number} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Register Date" name="register_Date" value={formData.register_Date} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Select Identity"
                name="select_identity"
                value={formData.select_identity}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Address" name="siteInfo" value={formData.siteInfo} onChange={handleChange} />
            </Grid>
          </Grid>

          {/* <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 3 }}>
            Continue
          </Button> */}
        </Paper>
      </Container>
    </>
  );
};

export default View;
