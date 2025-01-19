/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
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
// import { useEffect, useState } from 'react';
import { FormControl, FormHelperText, FormLabel, MenuItem, Select } from '@mui/material';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import axios from 'axios';
import { url } from 'core/url';
import { addPublications } from 'core/helperFurtion';
// import { apiget, apipost } from '../../service/api';

const AddPublications = (props) => {
  const { open, handleClose, fetchData } = props;
  //   const [leadData, setLeadData] = useState([]);
  //   const [contactData, setContactData] = useState([]);

  //   const userid = localStorage.getItem('user_id');
  //   const userRole = localStorage.getItem('userRole');

  // -----------  validationSchema
  const validationSchema = yup.object({
    publisherName: yup.string().required('Book Title is required'),
    // bookName: yup.string().required('Book Title is required'),
    // title: yup.string().required('Book Title is required'),
    // author: yup.string().required('Book Title is required'),
    address: yup.string().required('Address is required'),
    // startDate: yup.string().required('Start Date is required'),
    description: yup.string().required('Description is required')
  });

  // -----------   initialValues
  // const initialValues = {
  //   subject: '',
  //   status: '',
  //   startDate: '',
  //   assignedUser: ''
  // endDate: '',
  // duration: '',
  // location: '',
  // relatedTo: '',
  // note: ''
  // createdBy: userid,
  // lead_id: _id,
  // contact_id: _id
  // };

  // add meeting api
  //   const addMeeting = async (values) => {
  //     const data = values;
  //     const result = await apipost('meeting/add', data);
  //     setUserAction(result);

  //     if (result && result.status === 201) {
  //       formik.resetForm();
  //       handleClose();
  //       toast.success(result.data.message);
  //     }
  //   };

  // formik
  // const formik = useFormik({
  //   initialValues,
  //   validationSchema,
  //   onSubmit: async (values, { resetForm }) => {
  //     //   addMeeting(values);
  //     console.log('MeetingsValues', values);
  //     handleClose();
  //     toast.success('Meeting Add successfully');
  //     resetForm();
  //   }
  // });

  // lead api
  //   const fetchLeadData = async () => {
  //     const result = await apiget(userRole === 'admin' ? `lead/list` : `lead/list/?createdBy=${userid}`);
  //     if (result && result.status === 200) {
  //       setLeadData(result?.data?.result);
  //     }
  //   };

  // contact api
  //   const fetchContactData = async () => {
  //     const result = await apiget(userRole === 'admin' ? `contact/list` : `contact/list/?createdBy=${userid}`);
  //     if (result && result.status === 200) {
  //       setContactData(result?.data?.result);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchLeadData();
  //     fetchContactData();
  //     // formik.values.meetingAttendes = data?.emailAddress
  //   }, [open, data]);

  // const initialValues = yup.object({
  //   subject: yup.string().required('').typeError('Publications')
  // });
  const formik = useFormik({
    initialValues: {
      publisherName: '',
      // bookName: '',
      // title: '',
      // author: '',
      address: '',
      // startDate: '',
      description: ''
    },
    validationSchema,

    onSubmit: async (values) => {
      console.log('Submitted values', values);
      try {
        // const response = await axios.post('http://localhost:4300/user/addPublications', values);
        const response = await addPublications(url.publications.addPublications, values);
        console.log('Form submitted successfully:', response);
        console.log();
        fetchData();
        handleClose();
      } catch (error) {
        console.error('Error submitting form:', error);
      }
      toast.success('Publications details added successfully');
      formik.resetForm();
      handleClose();
    }
  });

  return (
    <div>
      <Dialog open={open} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
        <form>
          <DialogTitle
            id="scroll-dialog-title"
            style={{
              display: 'flex',
              justifyContent: 'space-between'
              // backgroundColor: "#2b4054",
              // color: "white",
            }}
          >
            <Typography variant="h6">Add Publications </Typography>
            <Typography>
              <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
            </Typography>
          </DialogTitle>

          <DialogContent dividers>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Publisher Name</FormLabel>
                  <TextField
                    id="publisherName"
                    name="publisherName"
                    size="small"
                    maxRows={10}
                    fullWidth
                    value={formik.values.publisherName}
                    onChange={formik.handleChange}
                    error={formik.touched.publisherName && Boolean(formik.errors.publisherName)}
                    helperText={formik.touched.publisherName && formik.errors.publisherName}
                    inputProps={{ maxLength: 50 }}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Book Name</FormLabel>
                  <TextField
                    id="bookName"
                    name="bookName"
                    size="small"
                    maxRows={10}
                    fullWidth
                    value={formik.values.bookName}
                    onChange={formik.handleChange}
                    error={formik.touched.bookName && Boolean(formik.errors.bookName)}
                    helperText={formik.touched.bookName && formik.errors.bookName}
                    inputProps={{ maxLength: 50 }}
                  />
                </Grid> */}
                {/* <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Title</FormLabel>
                  <TextField
                    id="title"
                    name="title"
                    size="small"
                    maxRows={10}
                    fullWidth
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
                    inputProps={{ maxLength: 50 }}
                  />
                </Grid> */}
                {/* <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Author</FormLabel>
                  <TextField
                    id="author"
                    name="author"
                    size="small"
                    maxRows={10}
                    fullWidth
                    value={formik.values.author}
                    onChange={formik.handleChange}
                    error={formik.touched.author && Boolean(formik.errors.author)}
                    helperText={formik.touched.author && formik.errors.author}
                    inputProps={{ maxLength: 50 }}
                  />
                </Grid> */}
                {/* <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Start Date</FormLabel>
                  <TextField
                    name="startDate"
                    type={'datetime-local'}
                    size="small"
                    fullWidth
                    value={dayjs(formik.values.startDate).format('YYYY-MM-DD HH:mm:ss')}
                    onChange={formik.handleChange}
                    error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                    helperText={formik.touched.startDate && formik.errors.startDate}
                  />
                </Grid> */}

                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Address</FormLabel>
                  <TextField
                    id="address"
                    name="address"
                    size="small"
                    maxRows={10}
                    fullWidth
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    error={formik.touched.address && Boolean(formik.errors.address)}
                    helperText={formik.touched.address && formik.errors.address}
                    inputProps={{ maxLength: 100 }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <FormLabel>Description</FormLabel>
                  <TextField
                    id="description"
                    name="description"
                    size="small"
                    maxRows={10}
                    fullWidth
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                    inputProps={{ maxLength: 300 }}
                  />
                </Grid>
              </Grid>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              type="submit"
              variant="contained"
              onClick={formik.handleSubmit}
              style={{ textTransform: 'capitalize' }}
              color="secondary"
            >
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
        </form>
      </Dialog>
    </div>
  );
};

export default AddPublications;
