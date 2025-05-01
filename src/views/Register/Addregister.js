import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { FormLabel, FormControl, MenuItem, Select } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import { url } from 'core/url';
import { postApi } from 'core/apiClient';

const AddRegister = (props) => {
  const { open, handleClose, fetchData } = props;
  const userid = localStorage.getItem('user_id');
  const [isloading, setIsloading] = useState(false);

  const todayDate = new Date().toISOString().split('T')[0];

  const validationSchema = yup.object({
    student_Name: yup.string().required('Student Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    mobile_Number: yup
      .string()
      .matches(/^[0-9]{10}$/, 'Phone number is invalid')
      .required('Phone number is required'),
    select_identity: yup.string().required('Select Identity is required'),
    upload_identity: yup.mixed().required('Select a file to upload')
  });
  const user = JSON.parse(localStorage.getItem('user'));
  const adminId = user?._id;
  const formik = useFormik({
    initialValues: {
      student_Name: '',
      email: '',
      mobile_Number: '',
      select_identity: '',
      upload_identity: '',
      register_Date: todayDate
    },
    validationSchema,

    onSubmit: async (values) => {
      setIsloading(true);

      const formData = new FormData();
      formData.append('student_id', values.student_id);
      formData.append('student_Name', values.student_Name);
      formData.append('email', values.email);
      formData.append('mobile_Number', values.mobile_Number);
      formData.append('select_identity', values.select_identity);
      formData.append('upload_identity', values.upload_identity);
      formData.append('register_Date', values.register_Date);
      formData.append('adminId', adminId);
      try {
        const response = await postApi(url.studentRegister.addRegister, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Register details added successfully');
        fetchData();
        setIsloading(false);

        handleClose();

        formik.resetForm();
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error('Failed to add register details');
        setIsloading(false);
      }
    }
  });
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue('upload_identity', file);
  };
  useEffect(() => {
    if (open) {
      formik.resetForm();
    }
  }, [open]);
  return (
    <Dialog open={open} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
      <DialogTitle
        id="scroll-dialog-title"
        style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="h6">Add New Student</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Student Name</FormLabel>
                <TextField
                  id="student_Name"
                  name="student_Name"
                  size="small"
                  fullWidth
                  value={formik.values.student_Name}
                  onChange={formik.handleChange}
                  error={formik.touched.student_Name && Boolean(formik.errors.student_Name)}
                  helperText={formik.touched.student_Name && formik.errors.student_Name}
                  inputProps={{ maxLength: 30 }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Email Address</FormLabel>
                <TextField
                  id="email"
                  name="email"
                  type="email"
                  size="small"
                  fullWidth
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  inputProps={{ maxLength: 30 }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Mobile Number</FormLabel>
                <TextField
                  id="mobile_Number"
                  name="mobile_Number"
                  size="small"
                  fullWidth
                  value={formik.values.mobile_Number}
                  onChange={formik.handleChange}
                  error={formik.touched.mobile_Number && Boolean(formik.errors.mobile_Number)}
                  helperText={formik.touched.mobile_Number && formik.errors.mobile_Number}
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Select Identity</FormLabel>
                <FormControl fullWidth>
                  <Select
                    id="select_identity"
                    name="select_identity"
                    size="small"
                    value={formik.values.select_identity}
                    onChange={formik.handleChange}
                    error={formik.touched.select_identity && Boolean(formik.errors.select_identity)}
                  >
                    <MenuItem value="Aadhar Card">Aadhar Card</MenuItem>
                    <MenuItem value="Pan Card">Pan Card</MenuItem>
                    <MenuItem value="Voter Id Card">Voter Id Card</MenuItem>
                    <MenuItem value="Driving Licence">Driving Licence</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Register Date</FormLabel>
                <TextField
                  name="date"
                  type="date"
                  size="small"
                  fullWidth
                  value={formik.values.date || todayDate}
                  onChange={formik.handleChange}
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                  inputProps={{ min: todayDate }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Upload Identity</FormLabel>
                <FormControl fullWidth>
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{ width: '100%' }} />

                  {formik.touched.upload_identity && formik.errors.upload_identity && (
                    <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.upload_identity}</div>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </DialogContentText>
          <DialogActions>
          <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isloading}
              style={{
                textTransform: 'capitalize',
                backgroundColor: isloading ? '#ccc' : '',
                color: isloading ? '#666' : '',
                pointerEvents: isloading ? 'none' : 'auto'
              }}
            >
              {isloading ? 'Saving...' : 'Save'}
            </Button>
            <Button
              onClick={() => {
                formik.resetForm();
                handleClose();
              }}
              variant="outlined"
              color="error"
            >
              Cancel
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRegister;
