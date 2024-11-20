import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { FormLabel, Grid, TextField } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import Palette from '../../ui-component/ThemePalette';
import axios from 'axios';
import Lead from './index.js';

const AddLead = (props) => {
  // const { open, handleClose } = props;
  const { open, handleClose, fetchData } = props;

  const validationSchema = yup.object({
    bookName: yup
      .string()
      // .matches(/^[a-zA-Z0-9 ]*$/, 'Only letters, numbers are allowed')
      .required('Book Title is required'),
    // .string()
    // // .matches(/^[a-zA-Z]+$/, 'Only characters are allowed')
    // .required('Book Name is required'),
    bookTitle: yup.string().required('Book Title is required'),
    authorName: yup
      .string()

      .required('Author name is required'),
    bookIssueDate: yup.date().required('Book Issue date is required'),
    publisherName: yup
      .string()
      // .matches(/^[a-zA-Z0-9 ]*$/, 'Only letters, numbers are allowed')
      .required('Book Title is required'),
    totalPrice: yup.number().required('Total Price is required').typeError('Must be a number'),
    returnPrice: yup.number().required('Return Price is required').typeError('Must be a number'),
    quantity: yup.number().min(1, 'Quantity must be at least 1').required('Return Price is required').typeError('Must be a number'),
    bookDistribution: yup.string().required('Distribution is required')
  });
  // muje aasa velidastion chahia jisame muje bus characters hi chahia oor space bhi ho sakti he

  const validatioenSchema = yup.object({
    bookName: yup.string().required('').typeError('Book')
  });
  const formik = useFormik({
    initialValues: {
      bookName: '',
      bookTitle: '',
      authorName: '',
      bookIssueDate: '',
      publisherName: '',
      totalPrice: '',
      returnPrice: '',
      quantity: '',
      bookDistribution: ''
    },
    validationSchema,

    onSubmit: async (values) => {
      console.log('Submitted values', values);
      try {
        const response = await axios.post('http://localhost:4300/user/addBook', values);
        console.log('Form submitted successfully:', response);
        console.log();
        fetchData();
        handleClose();
      } catch (error) {
        console.error('Error submitting form:', error);
      }
      toast.success('Book details added successfully');
      formik.resetForm();
      handleClose();
    }
  });

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
        <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Add New Books</Typography>
          <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
        </DialogTitle>
        <DialogContent dividers>
          <form onSubmit={formik.handleSubmit}>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              <Typography style={{ marginBottom: '15px' }} variant="h6">
                Books Information
              </Typography>
              <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
                <Grid item xs={12} sm={4} md={4}>
                  <FormLabel> Book Name</FormLabel>
                  <TextField
                    id="bookName"
                    name="bookName"
                    size="small"
                    fullWidth
                    value={formik.values.bookName}
                    onChange={formik.handleChange}
                    error={formik.touched.bookName && Boolean(formik.errors.bookName)}
                    helperText={formik.touched.bookName && formik.errors.bookName}
                    inputProps={{ maxLength: 15 }}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <FormLabel>Book Title</FormLabel>
                  <TextField
                    id="bookTitle"
                    name="bookTitle"
                    size="small"
                    fullWidth
                    value={formik.values.bookTitle}
                    onChange={formik.handleChange}
                    error={formik.touched.bookTitle && Boolean(formik.errors.bookTitle)}
                    helperText={formik.touched.bookTitle && formik.errors.bookTitle}
                    inputProps={{ maxLength: 15 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Book Issue Date</FormLabel>
                  <TextField
                    name="bookIssueDate"
                    type="date"
                    size="small"
                    fullWidth
                    value={formik.values.bookIssueDate}
                    onChange={formik.handleChange}
                    error={formik.touched.bookIssueDate && Boolean(formik.errors.bookIssueDate)}
                    helperText={formik.touched.bookIssueDate && formik.errors.bookIssueDate}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormLabel>Author Name</FormLabel>
                  <TextField
                    id="authorName"
                    name="authorName"
                    size="small"
                    fullWidth
                    type="string"
                    value={formik.values.authorName}
                    onChange={formik.handleChange}
                    error={formik.touched.authorName && String(formik.errors.authorName)}
                    helperText={formik.touched.authorName && formik.errors.authorName}
                    inputProps={{ maxLength: 15 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormLabel>Publisher Name</FormLabel>
                  <TextField
                    id="publisherName"
                    name="publisherName"
                    size="small"
                    fullWidth
                    value={formik.values.publisherName}
                    onChange={formik.handleChange}
                    error={formik.touched.publisherName && String(formik.errors.publisherName)}
                    helperText={formik.touched.publisherName && formik.errors.publisherName}
                    inputProps={{ maxLength: 15 }}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <FormLabel>Total Price</FormLabel>
                  <TextField
                    id="totalPrice"
                    name="totalPrice"
                    size="small"
                    fullWidth
                    value={formik.values.totalPrice}
                    onChange={formik.handleChange}
                    error={formik.touched.totalPrice && Boolean(formik.errors.totalPrice)}
                    helperText={formik.touched.totalPrice && formik.errors.totalPrice}
                    inputProps={{ maxLength: 5 }}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <FormLabel>Return Price</FormLabel>
                  <TextField
                    id="returnPrice"
                    name="returnPrice"
                    size="small"
                    fullWidth
                    value={formik.values.returnPrice}
                    onChange={formik.handleChange}
                    error={formik.touched.returnPrice && Boolean(formik.errors.returnPrice)}
                    helperText={formik.touched.returnPrice && formik.errors.returnPrice}
                    inputProps={{ maxLength: 5 }}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  <FormLabel>Total Quantity</FormLabel>
                  <TextField
                    id="quantity"
                    name="quantity"
                    size="small"
                    fullWidth
                    value={formik.values.quantity}
                    onChange={formik.handleChange}
                    error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                    helperText={formik.touched.quantity && formik.errors.quantity}
                    inputProps={{ maxLength: 5 }}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12}>
                  <FormLabel>Book Description</FormLabel>
                  <TextField
                    id="bookDistribution"
                    name="bookDistribution"
                    size="small"
                    multiline
                    rows={5}
                    fullWidth
                    value={formik.values.bookDistribution}
                    onChange={formik.handleChange}
                    error={formik.touched.bookDistribution && Boolean(formik.errors.bookDistribution)}
                    helperText={formik.touched.bookDistribution && formik.errors.bookDistribution}
                    inputProps={{ maxLength: 65 }}
                  />
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
    </div>
  );
};

export default AddLead;
