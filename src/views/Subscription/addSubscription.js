import * as React from 'react';
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

const AddRegister = (props) => {
  const { open, handleClose, fetchData } = props;
  const userid = localStorage.getItem('user_id');

  // -----------  validationSchema
  const validationSchema = yup.object({
    // student_id: yup.string().required('Student is required'),
    student_Name: yup
      .string()
      // .matches(/^[a-zA-Z]+$/, 'Only characters are allowed')
      .required('Student Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    mobile_Number: yup
      .string()
      .matches(/^[0-9]{10}$/, 'Phone number is invalid')
      .required('Phone number is required'),
    // select_identity: yup.string().required('Select Identity is required'),
    select_identity: yup.string().required('Select Identity is required'),
    // upload_identity: yup.mixed().required('Student identity image is required'),
    //  yup.string(),
    register_Date: yup.string().required('Register Date is required'),
    upload_identity: yup.mixed().required('Select a file to upload')
  });

  const formik = useFormik({
    initialValues: {
      // student_id: '',
      student_Name: '',
      email: '',
      mobile_Number: '',
      select_identity: '',
      upload_identity: null,
      register_Date: ''
    },
    validationSchema,
 
    onSubmit: async (values) => {
      console.log('on submit');
      console.log(`values`, values);

      const formData = new FormData();
      formData.append('student_id', values.student_id);
      formData.append('student_Name', values.student_Name);
      formData.append('email', values.email);
      formData.append('mobile_Number', values.mobile_Number);
      formData.append('select_identity', values.select_identity);
      formData.append('upload_identity', values.upload_identity);
      formData.append('register_Date', values.register_Date);
 
      try {
        console.log('try bolck');
 
        const response = await axios.post('http://64.227.130.216:4300/user/addRegister', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Form submitted successfully:', response);
        toast.success('Register details added successfully');
        fetchData();
        handleClose();
        formik.resetForm();
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error('Failed to add register details');
      }
    }
  });
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue('upload_identity', file);
  };

  return (
    <Dialog open={open} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
      <DialogTitle
        id="scroll-dialog-title"
        style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="h6">Add New Subscription</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>

      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
              
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Title</FormLabel>
                <TextField
                  id="title"
                  name="title"
                  size="small"
                  fullWidth
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                  inputProps={{ maxLength: 50 }}
                  InputProps={{
                    style: {
                      height: '50px'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel></FormLabel>
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
                  InputProps={{
                    style: {
                      height: '50px'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Mobile Number</FormLabel>
                <TextField
                  id="mobile_Number"
                  name="mobile_Number"
                  size="small"
                  type="number"
                  fullWidth
                  value={formik.values.mobile_Number}
                  onChange={formik.handleChange}
                  error={formik.touched.mobile_Number && Boolean(formik.errors.mobile_Number)}
                  helperText={formik.touched.mobile_Number && formik.errors.mobile_Number}
                  inputProps={{ maxLength: 10 }}
                  InputProps={{
                    style: {
                      height: '50px'
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Select Identity</FormLabel>
                <FormControl fullWidth>
                  <Select
                    id="select_identity"
                    name="select_identity"
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
                  id="register_Date"
                  name="register_Date"
                  size="small"
                  type="datetime-local"
                  fullWidth
                  value={formik.values.register_Date}
                  onChange={formik.handleChange}
                  error={formik.touched.register_Date && Boolean(formik.errors.register_Date)}
                  helperText={formik.touched.register_Date && formik.errors.register_Date}
                  InputProps={{
                    style: {
                      height: '50px'
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <FormLabel>Upload Identity</FormLabel>
                <FormControl fullWidth>
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{ width: '100%' }} />
                  {/* <input type="file" name="profilePic" onChange={handleFileChange} style={{ width: '100%' }} /> */}

                  {formik.touched.upload_identity && formik.errors.upload_identity && (
                    <div style={{ color: 'red', fontSize: '12px'  }}>{formik.errors.upload_identity}</div>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </DialogContentText>
          <DialogActions>
            <Button type="submit" variant="contained" color="primary">
              Save
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
