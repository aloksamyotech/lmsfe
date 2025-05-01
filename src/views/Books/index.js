import { useState, useEffect, useRef } from 'react';
import { Stack, Button, Container, Typography, Box, Card, Dialog, TextField } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import AddLead from './AddBooks.js';
import axios from 'axios';
import { toast } from 'react-toastify';
import HomeIcon from '@mui/icons-material/Home';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import defaultBook from './bookDummy.jpeg';
import { url } from 'core/url';
import { Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import { fontSize } from '@mui/system';
import { deleteApi, getApi, updateApi, postApi } from 'core/apiClient';
import ClearIcon from '@mui/icons-material/Clear';

const BookManagement = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const fileInput = useRef([]);
  const [errors, setErrors] = useState({});
  const [openBulkUploadDialog, setOpenBulkUploadDialog] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const XLSX = require('xlsx');

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
  };
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    const urlWindow = window.location.href;
    const parts = urlWindow.split('/');
    const extractedId = parts[parts.length - 1];
    setStudentId(extractedId);
  }, []);

  const columns = [
    {
      field: 'sNo',
      headerName: 'sNo.',
      flex: 0.5
    },
    {
      field: 'bookName',
      headerName: 'Book Name',
      flex: 1,
    },
    {
      field: 'upload_Book',
      headerName: 'Book Image',
      flex: 1,
      renderCell: (params) => {
        const uploadBook = params?.row?.upload_Book;
        const imageUrl = uploadBook ? `${url.baseurl.baseurl.replace(/\/$/, '')}/${uploadBook.replace(/\\/g, '/')}` : defaultBook;

        return (
          <img 
            src={imageUrl} 
            alt="Book" 
            style={{
              width: '40px',
              height: '40px',  
              objectFit: 'cover', 
              borderRadius: '50%', 
            }} 
          />
        );
      }
    },    
    {
      field: 'title',
      headerName: 'Book Title',
      flex: 1,
    },
    {
      field: 'publisherName',
      headerName: 'Publisher Name',
      flex: 1
    },
    {
      field: 'author',
      headerName: 'Author Name',
      flex: 1
    },

    {
      field: 'quantity',
      headerName: 'Available Quantity',
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const quantity = params.value;
        return (
          <Typography
            sx={{
              color: quantity === 'Not Available' ? 'red' : 'black',
              fontWeight: quantity === 'Not Available' ? 'bold' : 'normal',
            }}
          >
            {quantity}
          </Typography>
        );
      },
    },
    
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => (
        <div>
          <Button color="primary" onClick={() => handleEdit(params.row)} style={{ margin: '-9px' }}>
            <EditIcon />
          </Button>
          <Button color="secondary" onClick={() => handleDelete(params.row.id)} style={{ margin: '-9px' }}>
            <DeleteIcon />
          </Button>
        </div>
      )
    }
  ];

  const fetchData = async () => {
    try {
      const response = await getApi(url.bookManagenent.bookmanagementTable);
      const fetchedData = response?.data?.data?.map((item) => ({
        id: item._id,
        bookName: item.bookName,
        upload_Book: item.upload_Book,
        title: item.title,
        publisherName: item.publisherName,
        author: item.author,
        quantity: item.bookQuantity > 0 ? item.bookQuantity : 'Not Available'
      }));
      setData(fetchedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleEdit = (book) => {
    setEditData(book);
    setErrors({});
  };

  const handleSaveEdit = async () => {
    setErrors({});
    const newErrors = {};

    if (!editData.bookName) newErrors.bookName = 'Book Name is required';
    if (!editData.title) newErrors.title = 'Book Title is required';
    if (!editData.publisherName) newErrors.publisherName = 'Publisher Name is required';
    if (!editData.author) newErrors.author = 'Author Name is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const response = await updateApi(`${url.bookManagenent.editBook}${editData.id}`, editData);
      const updatedBook = response.data;
      setData((prevData) => prevData.map((item) => (item.id === updatedBook.id ? updatedBook : item)));
      setEditData(null);
      toast.success('Book details Edit successfully');
    } catch (error) {
      console.error('Error updating book:', error);
    }
    fetchData();
  };

  const handleDelete = (id) => {
    setBookToDelete(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {

      await deleteApi(`${url.bookManagenent.delete}${bookToDelete}`);

      setData((prevData) => prevData.filter((book) => book.id !== bookToDelete));
      setOpenDeleteDialog(false);
      setBookToDelete(null);
      toast.success('Book details Deleted successfully');
    } catch (error) {
      console.error('Error deleting book:', error);
      setOpenDeleteDialog(false);
      setBookToDelete(null);
    }
  };

  const cancelDelete = () => {
    setOpenDeleteDialog(false);
    setBookToDelete(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(data);
    };
    reader.readAsBinaryString(file);
  };

  const handleBulkUpload = async () => {
    setIsloading(true);
    try {
      if (!excelData || excelData.length === 0) {
        toast.error('No data to upload');
        setIsloading(false);
        return;
      }
      const response = await postApi(url.bookManagenent.addManyBooks, excelData);
      toast.success(`Data Uploaded Successfully`);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error uploading data:', error);
      alert('Error uploading data');
      setIsloading(false);
    }
  };

  return (
    <>
      <AddLead open={openAdd} fetchData={fetchData} handleClose={handleCloseAdd} />
      <Container>
        <Box
          sx={{
            backgroundColor: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            height: '50px',
            justifyContent: 'space-between',
            marginBottom: '-18px'
          }}
        >
          <Breadcrumbs separator="/" aria-label="breadcrumb" sx={{ display: 'flex', alignItems: 'center' }}>
            <MuiLink component={Link} to="/dashboard/default" color="inherit">
              <HomeIcon sx={{ color: '#5e35b1' }} />
            </MuiLink>
            <MuiLink component={Link} to="/dashboard/BookManagement" color="inherit" underline="none">
              Book Management
            </MuiLink>
          </Breadcrumbs>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => setOpenBulkUploadDialog(true)}>
              <Typography sx={{ fontSize: '16px' }}>Bulk Upload</Typography>              
            </Button>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
            <Typography sx={{ fontSize: '15px' }}>Add New Book</Typography>              
            </Button>
          </Stack>
        </Box>

        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}></Stack>
        <TableStyle>
          <Box width="100%">
            <Card style={{ paddingTop: '15px', height: '750px' }}>
              <DataGrid
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10, page: 0 }
                  }
                }}
                pagination
                rows={data.map((row, index) => ({ ...row, sNo: index + 1 }))}
                columns={columns}
                getRowId={(row) => row.id}
                slots={{ toolbar: GridToolbar }}
                slotProps={{ toolbar: { showQuickFilter: true } }}
              />
            </Card>
          </Box>
        </TableStyle>

        {editData && (
          <Dialog open={true} onClose={() => setEditData(null)}>
            <Box p={3}>
              <Typography variant="h6">Edit Book</Typography>
              <TextField
                label="Book Name"
                value={editData.bookName}
                onChange={(e) => setEditData({ ...editData, bookName: e.target.value })}
                fullWidth
                margin="normal"
                error={!!errors.bookName}
                helperText={errors.bookName}
                inputProps={{ maxLength: 50 }}
              />
              <TextField
                label="Book Title"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                fullWidth
                margin="normal"
                error={!!errors.title}
                helperText={errors.title}
                inputProps={{ maxLength: 50 }}
              />
              <TextField
                label="Publisher Name"
                value={editData.publisherName}
                onChange={(e) => setEditData({ ...editData, publisherName: e.target.value })}
                fullWidth
                margin="normal"
                error={!!errors.publisherName}
                helperText={errors.publisherName}
                inputProps={{ maxLength: 50 }}
              />
              <TextField
                label="Author Name"
                value={editData.author}
                onChange={(e) => setEditData({ ...editData, author: e.target.value })}
                fullWidth
                margin="normal"
                error={!!errors.author}
                helperText={errors.author}
                inputProps={{ maxLength: 50 }}
              />

              <Button onClick={handleSaveEdit} variant="contained" color="primary">
                Save
              </Button>
              <Button onClick={() => setEditData(null)} variant="outlined" color="secondary" style={{ marginLeft: '16px' }}>
                Cancel
              </Button>
            </Box>
          </Dialog>
        )}

        <Dialog open={openDeleteDialog} onClose={cancelDelete}>
          <Box p={3}>
            <Typography variant="h6">Are you sure you want to delete this book?</Typography>
            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
              <Button onClick={cancelDelete} variant="outlined" color="secondary">
                Cancel
              </Button>
              <Button onClick={confirmDelete} variant="contained" color="primary">
                OK
              </Button>
            </Stack>
          </Box>
        </Dialog>
        <Dialog open={openBulkUploadDialog} onClose={() => setOpenBulkUploadDialog(false)}>
          <Box p={3} width={400}>
            <ClearIcon onClick={() => setOpenBulkUploadDialog(false)} style={{ cursor: 'pointer', float: 'right' }} />

            <Box alignItems="center" mb={2}>
              <Typography variant="h5">Upload Excel File</Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Iconify icon="eva:file-download-fill" />}
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/BookFile.xlsx';
                  link.download = 'SampleFile.xlsx';
                  link.click();
                }}
                sx={{ mr: '11px' ,mt:'10px'}}
              >
                <Typography fontSize="13px">Download Sample File</Typography>
              </Button>
            </Box>

            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} style={{ marginBottom: '16px' }} />

            <Box display="flex" justifyContent="right" gap={2}>
              <Button variant="contained" color="primary" onClick={handleBulkUpload} disabled={isloading}>
                Upload 
              </Button>
            </Box>
          </Box>
        </Dialog>
      </Container>
    </>
  );
};

export default BookManagement;
