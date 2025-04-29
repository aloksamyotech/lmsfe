import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Avatar,
  Grid,
  Container,
  Paper,
  FormControl,
  InputAdornment,
  Select,
  MenuItem,
  InputLabel,
  Tabs,
  Tab,
  FormGroup,
  FormControlLabel,
  Switch,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { url } from 'core/url';
import { getApi, updateApi } from 'core/apiClient';

const currencySymbols = { USD: '$', EUR: '€', INR: '₹', GBP: '£' };

const View = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formData, setFormData] = useState({
    student_Name: '',
    mobile_Number: '',
    email: '',
    register_Date: '',
    select_identity: '',
    logo: null,
    currency: '',
    currencySymbol: '',
    id: ''
  });

  const [emailPrefs, setEmailPrefs] = useState({
    registrationEmail: true,
    allotmentEmail: true,
    purchesEmail: true,
    submissionEmail: true
  });

  const handleToggle = async (field) => {
    const updatedPrefs = {
      ...emailPrefs,
      [field]: !emailPrefs[field]
    };

    setEmailPrefs(updatedPrefs);
    try {
      await updateApi(url.admin.updateEmailContorller, {
        adminId: formData.id,
        ...updatedPrefs
      });

      toast.success('Preferences updated');
    } catch (error) {
      console.error('Toggle update error:', error);
      toast.error('Failed to update preference');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleChange = (e) => {
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
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && key !== 'id') {
          formDataToSend.append(key, value);
        }
      });
      formDataToSend.append('currencyCode', formData.currency);      
      const response = await updateApi(`${url.admin.edit}${formData.id}`, formDataToSend, {
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
      toast.error('Something went wrong while updating profile');
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await getApi(url.admin.adminProfile);
    
        if (response.data.status) {
          const user = JSON.parse(localStorage.getItem('user'));
          const adminId = user?._id;
    
          const student = response.data.students.find(s => s._id === adminId);
    
          if (!student) {
            console.error("Admin not found with provided ID");
            return;
          }
    
          const formattedDate = new Date(student.register_Date).toLocaleDateString('en-GB');
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
    
          setEmailPrefs({
            registrationEmail: student.registrationEmail,
            allotmentEmail: student.allotmentEmail,
            purchesEmail: student.purchesEmail,
            submissionEmail: student.submissionEmail
          });
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    
    fetchProfileData();
  }, []);
  const logoPreview =
    formData.logo instanceof File ? URL.createObjectURL(formData.logo) : formData.logo ? `${url.publicImage}${formData.logo}` : '';

  const handlePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (oldPassword === newPassword) {
      toast.error("Old and new password should not be the same");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New and confirm passwords do not match");
      return;
    }
   const token = localStorage.getItem('loginToken');    
  if (!token) {
    toast.error("You are not logged in.");
    return;
  }
   
    try {
      const response = await updateApi(`${url.admin.updatepassword}`, 
        {
          oldPassword,
          newPassword,
        },
      );

      toast.success(response.data.message || "Password updated successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  
  return (
    <>
      <Box
        sx={{ backgroundColor: 'white', padding: '10px 20px', borderRadius: '8px', marginBottom: '10px', marginLeft: '5%', width: '90%' }}
      >
        <Breadcrumbs separator="/" aria-label="breadcrumb">
          <MuiLink component={Link} to="/dashboard/default" color="inherit">
            <HomeIcon />
          </MuiLink>
          <MuiLink component={Link} to="/dashboard/profile" color="inherit" underline="none">
            Admin Profile
          </MuiLink>
        </Breadcrumbs>
      </Box>
      <Box sx={{ backgroundColor: 'white', padding: '10px 20px', borderRadius: '8px', marginBottom: '10px', marginLeft: '5%', width: '90%' }}>
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
            <Tab label="Admin Profile" />
            <Tab label="Update Password" />
            <Tab label="Email Controller" />
          </Tabs>
      </Box>
      <Container>
        <Paper sx={{ p: 3, mt: 2, borderRadius: '10px', maxWidth: '850px', margin: 'auto' }}>
          {tabIndex === 0 && (
            <>
              <Avatar src={logoPreview} sx={{ width: 100, height: 100, mt: 2, mx: 'auto' }} />
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <TextField fullWidth label="Full Name" name="student_Name" value={formData.student_Name} onChange={handleChange} InputProps={{ readOnly: true }}/>
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Phone Number" name="mobile_Number" value={formData.mobile_Number} onChange={handleChange} InputProps={{ readOnly: true }}/>
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} InputProps={{ readOnly: true }}/>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Register Date"
                    name="register_Date"
                    value={formData.register_Date}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Select Identity"
                    name="select_identity"
                    value={formData.select_identity}
                    onChange={handleChange}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <TextField
                      label="Select Logo"
                      value={formData.logo instanceof File ? formData.logo.name : ''}
                      onClick={() => document.getElementById('file-input')?.click()}
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
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel id="currency-label">Currency</InputLabel>
                    <Select labelId="currency-label" name="currency" value={formData.currency} onChange={handleChange}>
                      <MenuItem value="USD">USD</MenuItem>
                      <MenuItem value="EUR">EUR</MenuItem>
                      <MenuItem value="INR">INR</MenuItem>
                      <MenuItem value="GBP">GBP</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
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
              <Button variant="contained" sx={{ mt: 3 }} onClick={handleSaveEdit}>
                Update
              </Button>
            </>
          )}

          {tabIndex === 1 && (
            <Box sx={{ mt: 3 }}>
              <TextField
                fullWidth
                label="Old Password"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" onClick={handlePassword} color="primary">
                Change Password
              </Button>
            </Box>
          )}
          {tabIndex === 2 && (
            <Box sx={{ mt: 3 }}>
              <FormGroup row sx={{ mb: 2, justifyContent: 'space-between' }}>
                <FormControlLabel
                  control={<Switch checked={emailPrefs.registrationEmail} onChange={() => handleToggle('registrationEmail')} />}
                  label="Registration Mail"
                />
                <FormControlLabel
                  control={<Switch checked={emailPrefs.allotmentEmail} onChange={() => handleToggle('allotmentEmail')} />}
                  label="Book Allotment Mail"
                />
                <FormControlLabel
                  control={<Switch checked={emailPrefs.purchesEmail} onChange={() => handleToggle('purchesEmail')} />}
                  label="Purchase Mail"
                />
                <FormControlLabel
                  control={<Switch checked={emailPrefs.submissionEmail} onChange={() => handleToggle('submissionEmail')} />}
                  label="Submission Mail"
                />
              </FormGroup>
            </Box>
          )}
        </Paper>
      </Container>
    </>
  );
};
export default View;
