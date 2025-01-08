import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { FormLabel, Grid, TextField, FormControl, Autocomplete, Select, MenuItem, FormHelperText, InputAdornment } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import { Field, useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useState, useEffect } from 'react';

const validationSchema = yup.object({
  bookName: yup.string().required('Book Name is required').max(100, 'Book Name must be less than or equal to 100 characters'),
  title: yup.string().required('Title is required').max(50, 'Title must be less than or equal to 50 characters'),
  author: yup.string().required('Author is required').max(50, 'Author Name must be less than or equal to 50 characters'),
  publisherName: yup.string().required('Publisher is required'),
  upload_Book: yup.mixed().required('Book Image is required'),
  bookDistribution: yup
    .string()
    .required('Book Description is required')
    .max(400, 'Description must be less than or equal to 400 characters')
});

const AddLead = (props) => {
  const { open, handleClose, fetchData } = props;
  const [publisherData, setPublisherData] = useState([]);

  const formik = useFormik({
    initialValues: {
      bookName: '',
      title: '',
      author: '',
      bookIssueDate: '',
      publisherName: '',
      upload_Book: null,
      bookDistribution: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      console.log('Submitting form with values:', values);
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        if (key !== 'upload_Book') {
          formData.append(key, values[key]);
        }
      });

      if (values.upload_Book) {
        formData.append('upload_Book', values.upload_Book);
      }

      try {
        const response = await axios.post('http://localhost:4300/user/addBook', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('Form submitted successfully:', response);
        fetchData();
        toast.success('Book details added successfully');
        formik.resetForm();
        handleClose();
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error('Error submitting the form');
      }
    }
  });

  useEffect(() => {
    const fetchPublisher = async () => {
      try {
        const response = await axios.get('http://localhost:4300/user/getPublications');
        console.log(`response ---------`, response.BookManagement);

        setPublisherData(response.data.PublicationsManagement);
      } catch (error) {
        console.error('Error fetching Publisher:', error);
      }
    };
    fetchPublisher();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue('upload_Book', file);
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
      <DialogTitle id="scroll-dialog-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6">Books Information</Typography>
        <ClearIcon onClick={handleClose} style={{ cursor: 'pointer' }} />
      </DialogTitle>
      <DialogContent dividers>
        <form onSubmit={formik.handleSubmit}>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
              <Grid item xs={12} sm={4} md={4}>
                <FormLabel>Book Name</FormLabel>
                <TextField
                  id="bookName"
                  name="bookName"
                  size="small"
                  fullWidth
                  value={formik.values.bookName}
                  onChange={formik.handleChange}
                  error={formik.touched.bookName && Boolean(formik.errors.bookName)}
                  helperText={formik.touched.bookName && formik.errors.bookName}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={4}>
                <FormLabel>Book Title</FormLabel>
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
                />
              </Grid>

              <Grid item xs={12} sm={4} md={4}>
                <FormLabel>Author Name</FormLabel>
                <TextField
                  id="author"
                  name="author"
                  size="small"
                  fullWidth
                  value={formik.values.author}
                  onChange={formik.handleChange}
                  error={formik.touched.author && Boolean(formik.errors.author)}
                  helperText={formik.touched.author && formik.errors.author}
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                <FormLabel>Publisher Name</FormLabel>
                <FormControl fullWidth error={formik.touched.publisherName && Boolean(formik.errors.publisherName)}>
                  <Autocomplete
                    id="publisherName"
                    name="publisherName"
                    value={formik.values.publisherName}
                    onChange={(event, newValue) => formik.setFieldValue('publisherName', newValue)}
                    options={publisherData.map((item) => item.publisherName)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        error={formik.touched.publisherName && Boolean(formik.errors.publisherName)}
                        helperText={formik.touched.publisherName && formik.errors.publisherName}
                      />
                    )}
                    sx={{ height: '40px' }}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4} md={4}>
                <FormLabel>Upload Book Image</FormLabel>
                <FormControl fullWidth error={formik.touched.upload_Book && Boolean(formik.errors.upload_Book)}>
                  <TextField
                    id="upload_Book"
                    name="upload_Book"
                    size="small"
                    fullWidth
                    value={formik.values.upload_Book ? formik.values.upload_Book.name : ''}
                    onClick={() => document.getElementById('file-input').click()}
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button sx={{ marginRight: '25px' }}>Choose File</Button>
                        </InputAdornment>
                      )
                    }}
                  />
                  <input id="file-input" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
                  {formik.touched.upload_Book && formik.errors.upload_Book && <FormHelperText>{formik.errors.upload_Book}</FormHelperText>}
                  {formik.values.upload_Book && formik.values.upload_Book.name && (
                    <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                      {formik.values.upload_Book.name}
                    </Typography>
                  )}
                </FormControl>
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
                  inputProps={{ maxLength: 400 }}
                />
              </Grid>
            </Grid>
          </DialogContentText>
          <DialogActions>
            <Button type="submit" variant="contained" color="primary" disabled={formik.isSubmitting}>
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

export default AddLead;
