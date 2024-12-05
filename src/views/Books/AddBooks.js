import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { FormLabel, Grid, TextField, FormControl, Select, MenuItem, FormHelperText, InputAdornment } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import ClearIcon from '@mui/icons-material/Clear';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useState, useEffect } from 'react';

const AddLead = (props) => {
  const { open, handleClose, fetchData } = props;
  const [publisherData, setPublisherData] = useState([]);
  const [borrowedBooksCount, setBorrowedBooksCount] = useState(0);

  const validationSchema = yup.object({
    bookName: yup.string().required('Book Title is required'),
    title: yup.string().required('Book Title is required'),
    author: yup.string().required('Author name is required'),
    bookIssueDate: yup.date().required('Book Issue date is required'),
    publisherName: yup.string().required('Publisher name is required'),
    upload_Book: yup.mixed().required('Select a file to upload'),
    bookDistribution: yup.string().required('Description is required')
  });

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
    // validationSchema,
    onSubmit: async (values) => {
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
              {/* <Grid item xs={12} sm={4} md={4}>
                <FormLabel>Book Name</FormLabel>
                <FormControl fullWidth error={formik.touched.bookName && Boolean(formik.errors.bookName)}>
                  <Select id="bookName" name="bookName" value={formik.values.bookName} onChange={formik.handleChange} displayEmpty>
                    {publisherData.map((item) => (
                      <MenuItem key={item._id} value={item.bookName}>
                        {item.bookName}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{formik.touched.bookName && formik.errors.bookName}</FormHelperText>
                </FormControl>
              </Grid> */}

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
                  inputProps={{ maxLength: 50 }}
                />
              </Grid>

              {/* <Grid item xs={12} sm={4} md={4}>
                <FormLabel>Book Title</FormLabel>
                <FormControl fullWidth error={formik.touched.title && Boolean(formik.errors.title)}>
                  <Select id="title" name="title" value={formik.values.title} onChange={formik.handleChange} displayEmpty>
                    {publisherData.map((item) => (
                      <MenuItem key={item._id} value={item.title}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{formik.touched.title && formik.errors.title}</FormHelperText>
                </FormControl>
              </Grid> */}

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

              {/* <Grid item xs={12} sm={4} md={4}>
                <FormLabel>Author Name</FormLabel>
                <FormControl fullWidth error={formik.touched.author && Boolean(formik.errors.author)}>
                  <Select id="author" name="author" value={formik.values.author} onChange={formik.handleChange} displayEmpty>
                    {publisherData.map((item) => (
                      <MenuItem key={item._id} value={item.author}>
                        {item.author}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{formik.touched.author && formik.errors.author}</FormHelperText>
                </FormControl>
              </Grid> */}

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
                  <Select
                    id="publisherName"
                    name="publisherName"
                    value={formik.values.publisherName}
                    onChange={formik.handleChange}
                    displayEmpty
                  >
                    {publisherData.map((item) => (
                      <MenuItem key={item._id} value={item.publisherName}>
                        {item.publisherName}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{formik.touched.publisherName && formik.errors.publisherName}</FormHelperText>
                </FormControl>
              </Grid>

              {/* <Grid item xs={12} sm={4} md={4}>
                <FormLabel>Upload Book Image</FormLabel>
                <FormControl fullWidth>
                  <input type="file" accept="image/*" onChange={handleFileChange} style={{ width: '100%' }} />
                  {formik.touched.upload_Book && formik.errors.upload_Book && (
                    <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.upload_Book}</div>
                  )}
                </FormControl>
              </Grid> */}

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
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4} md={4}>
                <FormLabel>Date</FormLabel>
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
            <Button type="submit" variant="contained" color="primary" disabled={!formik.isValid || formik.isSubmitting}>
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
