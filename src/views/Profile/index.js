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
  Link,
  Breadcrumbs,
  FormLabel,
  FormControl,
  InputAdornment,
  FormHelperText
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
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
    logo: null
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
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
      console.log('Data>>>>>>>>>>>>>>>>>> @123');
      console.log('Form Data:', formData);
      const formDataToSend = new FormData();
      formDataToSend.append('student_Name', formData.student_Name);
      formDataToSend.append('mobile_Number', formData.mobile_Number);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('register_Date', formData.register_Date);
      formDataToSend.append('select_identity', formData.select_identity);
      if (formData.logo) {
        formDataToSend.append('logo', formData.logo);
      }
      // const response = await axios.put(`http://localhost:4300/user/adminEditProfilePage/${formData.id}`, formDataToSend, {
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // });

      const response = await editAdmin(`${url.admin.edit}${formData.id}`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Data>>>>>>>>>>>>>>>>>>', response);
      // setEditData(null);
      toast.success('Update Profile details successfully');
      refreshPage();
    } catch (error) {
      console.error('Profile Update Failed:', error);
      // toast.error(' Profile Update Failed:');
    }
    // fetchData();
  };
  const [studentId, setStudentId] = useState(null);
  const [data, setData] = useState([]);
  useEffect(() => {
    const urlWindow = window.location.href;
    const parts = urlWindow.split('/');
    const extractedId = parts[parts.length - 1];
    setStudentId(extractedId);
    const fetchProfileData = async () => {
      try {
        // const response = await axios.get(`http://localhost:4300/user/adminProfilePage`);
        const response = await axios.get(url.admin.admin);

        // const response = await uploadLogoAdmin(url.admin.admin);

        if (response.data.status) {
          const formattedDate = formatDate(response.data.students[0].register_Date);
          setFormData({
            id: response.data.students[0]?._id,
            student_Name: response.data.students[0].student_Name,
            mobile_Number: response.data.students[0].mobile_Number,
            email: response.data.students[0].email,
            register_Date: formattedDate,
            select_identity: response.data.students[0].select_identity,
            logo: response.data.students[0].logo
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
        <Breadcrumbs aria-label="breadcrumb">
          <Link href="/" underline="hover" color="inherit">
            <HomeIcon sx={{ mr: 0.5, color: '#6A1B9A' }} />
          </Link>
          <Link href="/account-profile" underline="hover" color="inherit">
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
          <Avatar src={formData.logo ? formData.logo : 'profile.logoUrl'} alt="Profile" sx={{ width: 100, height: 100, mb: 2 }} />
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
