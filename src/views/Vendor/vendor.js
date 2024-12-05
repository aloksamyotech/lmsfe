/* eslint-disable react/prop-types */
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { FormControl, FormHelperText, FormLabel, Grid, MenuItem, Select, TextField } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import PolicyManagement from './index.js';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
// import { useEffect, useState } from 'react';

// import { apiget, apipost } from '../../service/api';
import Palette from '../../ui-component/ThemePalette.js';
import { hasShrinkWidth } from '@fullcalendar/core/internal';

const AddPolicy = (props) => {
  const { open, handleClose, fetchData } = props;

  //   const [contactList, setContactList] = useState([]);
  //   const userid = localStorage.getItem('user_id');
  //   const userRole = localStorage.getItem('userRole');

  // -----------  validationSchema
  const validationSchema = yup.object({
    vendorName: yup.string().required('Book Title is required'),
    // .matches(/^[a-zA-Z0-9 ]*$/, 'Only letters, numbers are allowed')
    companyName: yup.string().required('Book Title is required'),
    // .matches(/^[a-zA-Z0-9 ]*$/, 'Only letters, numbers are allowed')
    address: yup.string().required('Address is required'),
    // cityName: yup.string().required('City Name is required'),
    // .matches(/^[a-zA-Z0-9 ]*$/, 'Only letters, numbers are allowed')
    date: yup.date().required('Policy Start Date is required'),
    phoneNumber: yup
      .string()
      .matches(/^[0-9]{10}$/, 'Phone number is invalid')
      .required('Phone number is required'),
    email: yup.string().email('Invalid email').required('Email is required')
  });

  // -----------   initialValues
  const formik = useFormik({
    initialValues: {
      vendorName: '',
      companyName: '',
      address: '',
      // cityName: '',
      date: '',
      phoneNumber: '',
      email: ''
    },
    validationSchema,

    onSubmit: async (values) => {
      console.log('Submitted values', values);
      try {
        const response = await axios.post('http://localhost:4300/user/addVenderBook', values);
        console.log('Form submitted successfully:', response);
        console.log();
        fetchData();
        handleClose();
      } catch (error) {
        console.error('Error submitting form:', error);
      }
      toast.success('Vender details added successfully');
      formik.resetForm();
      handleClose();
    }
  });
  // add policy api
  //   const addPolicy = async (values) => {
  //     const data = values;
  //     const result = await apipost('policy/add', data);

  //     setUserAction(result);

  //     if (result && result.status === 201) {
  //       toast.success(result.data.message);
  //       formik.resetForm();
  //       handleClose();
  //     }
  //   };

  //   const fetchdata = async () => {
  //     const result = await apiget(userRole === 'admin' ? `contact/list` : `contact/list/?createdBy=${userid}`);
  //     if (result && result.status === 200) {
  //       setContactList(result?.data?.result);
  //     }
  //   };
  //   useEffect(() => {
  //     fetchdata();
  //   }, []);
  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
        <DialogTitle
          id="scroll-dialog-title"
          style={{
            display: 'flex',
            justifyContent: 'space-between'
            // backgroundColor: "#2b4054",
            // color: "white",
          }}
        >
          <Typography variant="h6">Add New Vendor</Typography>
          <Typography>
            <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <form>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              {/* <Typography style={{ marginBottom: '15px' }} variant="h6">
                Vendor
              </Typography> */}
              <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Vendor Name</FormLabel>
                  <TextField
                    id="vendorName"
                    name="vendorName"
                    size="small"
                    fullWidth
                    value={formik.values.vendorName}
                    onChange={formik.handleChange}
                    error={formik.touched.vendorName && Boolean(formik.errors.vendorName)}
                    helperText={formik.touched.vendorName && formik.errors.vendorName}
                    inputProps={{ maxLength: 50 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Company</FormLabel>
                  <TextField
                    id="companyName"
                    name="companyName"
                    size="small"
                    fullWidth
                    value={formik.values.companyName}
                    onChange={formik.handleChange}
                    error={formik.touched.companyName && Boolean(formik.errors.companyName)}
                    helperText={formik.touched.companyName && formik.errors.companyName}
                    inputProps={{ maxLength: 50 }}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>City</FormLabel>
                  <TextField
                    id="cityName"
                    name="cityName"
                    size="small"
                    fullWidth
                    value={formik.values.cityName}
                    onChange={formik.handleChange}
                    error={formik.touched.cityName && Boolean(formik.errors.cityName)}
                    helperText={formik.cityName && formik.errors.cityName}
                    inputProps={{ maxLength: 50 }}
                  />
                </Grid> */}
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Date</FormLabel>
                  <TextField
                    name="date"
                    type="date"
                    size="small"
                    fullWidth
                    value={formik.values.date}
                    onChange={formik.handleChange}
                    error={formik.touched.date && Boolean(formik.errors.date)}
                    helperText={formik.touched.date && formik.errors.date}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Phone Number</FormLabel>
                  <TextField
                    name="phoneNumber"
                    type="number"
                    size="small"
                    fullWidth
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                    helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                    inputProps={{ maxLength: 10 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Email</FormLabel>
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
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Address</FormLabel>
                  <TextField
                    id="address"
                    name="address"
                    size="small"
                    fullWidth
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    error={formik.touched.address && Boolean(formik.errors.address)}
                    helperText={formik.touched.address && formik.errors.address}
                    inputProps={{ maxLength: 100 }}
                  />
                </Grid>
              </Grid>
            </DialogContentText>
          </form>
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained" onClick={formik.handleSubmit} style={{ textTransform: 'capitalize' }} color="secondary">
            Save
          </Button>
          <Button
            type="reset"
            variant="outlined"
            style={{ textTransform: 'capitalize' }}
            onClick={() => {
              formik.resetForm();
              handleClose();
            }}
            color="error"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddPolicy;
