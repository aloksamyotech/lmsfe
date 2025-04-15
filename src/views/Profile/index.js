import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Avatar,
  Typography,
  Grid,
  Container,
  Paper,
  FormLabel,
  FormControl,
  InputAdornment,
  FormHelperText,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material';
import { Breadcrumbs, Link as MuiLink } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { url } from 'core/url';
import { createAdmin, editAdmin, loginAdmin, uploadLogoAdmin } from 'core/helperFurtion';
const formatDate = (date: string) => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};
const View = () => {

  const [formData, setFormData] = useState({
    student_Name: '',
    mobile_Number: '',
    email: '',
    register_Date: '',
    select_identity: '',
    logo: null,
    currency: '',
    currencySymbol: ''
  });

  const currencySymbols = {
    USD: '$',
    EUR: '€',
    INR: '₹',
    GBP: '£'
  };
  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      ...(name === 'currency' && {
        currencySymbol: currencySymbols[value] || ''
      })
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prev) => ({
      ...prev,
      logo: file
    }));
  };
  function refreshPage() {
    window.location.reload();
  }
  const handleSaveEdit = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('student_Name', formData.student_Name);
      formDataToSend.append('mobile_Number', formData.mobile_Number);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('register_Date', formData.register_Date);
      formDataToSend.append('select_identity', formData.select_identity);
      formDataToSend.append('currencyCode', formData.currency);
      formDataToSend.append('currencySymbol', formData.currencySymbol);

      if (formData.logo) {
        formDataToSend.append('logo', formData.logo);
      }
      const response = await editAdmin(`${url.admin.edit}${formData.id}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const updatedUser = {
        _id: formData.id,
        email: formData.email,
        currencyCode: formData.currency,
        currencySymbol: formData.currencySymbol,
        logo: response?.data?.updatedRegister?.logo || ''
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Update Profile details successfully');
      refreshPage();
    } catch (error) {
      console.error('Profile Update Failed:', error);
    }
  };
  const [studentId, setStudentId] = useState(null);
  useEffect(() => {
    const urlWindow = window.location.href;
    const parts = urlWindow.split('/');
    const extractedId = parts[parts.length - 1];
    setStudentId(extractedId);
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(url.admin.adminProfile);
        if (response.data.status) {
          const student = response.data.students[0];
          const formattedDate = formatDate(student.register_Date);
          const currency = student.currencyCode || 'INR';
          setFormData({
            id: student._id,
            student_Name: student.student_Name,
            mobile_Number: student.mobile_Number,
            email: student.email,
            register_Date: formattedDate,
            select_identity: student.select_identity,
            logo: student.logo,
            currency: currency,
            currencySymbol: currencySymbols[currency]
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
          width: '85%',
          marginLeft: '5%'
        }}
      >
        <Breadcrumbs
           separator="/"
           aria-label="breadcrumb"
           sx={{ display: 'flex', alignItems: 'center' }}
          >
            <MuiLink component={Link} to="/dashboard/default" color="inherit">
              <HomeIcon sx={{ color: '#5e35b1' }} />
            </MuiLink>
            <MuiLink component={Link} to="/dashboard/profile" color="inherit" underline="none">
              Admin Profile
            </MuiLink>
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
          <Avatar src={formData.logo ? formData.logo : 'profile.logoUrl'} alt="Profile" sx={{ width: 100, height: 100, mb: 2 }} />
          <Typography variant="caption" color="textSecondary"></Typography>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={6}>
              <TextField fullWidth label="Full Name" name="student_Name" value={formData.student_Name} onChange={handleChange} inputProps={{ maxLength: 30 }}/>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Phone Number" name="mobile_Number" value={formData.mobile_Number} onChange={handleChange}inputProps={{ maxLength: 10 }} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} inputProps={{ maxLength: 30 }}/>
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Register Date" name="register_Date" value={formData.register_Date} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField fullWidth label="Select Identity" name="select_identity" value={formData.select_identity} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <TextField
                  label="Select Logo"
                  name="logo"
                  value={formData.logo ? formData.logo.name : ''}
                  onClick={() => document.getElementById('file-input').click()}
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button>Choose File</Button>
                      </InputAdornment>
                    )
                  }}
                />
                <input id="file-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
              </FormControl>
            </Grid>
            {/* Currency Dropdown */}
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="currency-label">Currency</InputLabel>
                <Select
                  labelId="currency-label"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="INR">INR</MenuItem>
                  <MenuItem value="GBP">GBP</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Read-only Symbol Field */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Currency Symbol"
                name="currencySymbol"
                value={formData.currencySymbol}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
          <Button variant="contained" color="primary" onClick={handleSaveEdit} sx={{ mt: 3 }}>
            Update
          </Button>
        </Paper>
      </Container>
    </>
  );
};
export default View;
