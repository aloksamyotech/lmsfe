import { useState, useEffect, useRef } from 'react';
import { Stack, Button, Container, Typography, Box, Card, Dialog, TextField } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import AddLead from './AddBooks.js';
import axios from 'axios';

import { Breadcrumbs, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Lead = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const fileInput = useRef([]);

  const [openBulkUploadDialog, setOpenBulkUploadDialog] = useState(false);

  const XLSX = require('xlsx');

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    console.log('Breadcrumb clicked');
  };
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    const url = window.location.href;
    const parts = url.split('/');
    const extractedId = parts[parts.length - 1];
    setStudentId(extractedId);
  }, []);

  const columns = [
    {
      field: 'bookName',
      headerName: 'Book Name',
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize'
    },
    {
      field: 'upload_Book',
      headerName: 'Book Image',
      flex: 1,
      renderCell: (params) => {
        console.log(`params`, params.row);

        const imageUrl = `http://localhost:4300/${params?.row?.upload_Book}`;
        console.log(`imageUrl`, imageUrl);

        return <img src={imageUrl} alt="Book" style={{ width: '60px', height: '43px', objectFit: 'contain' }} />;
      }
    },
    {
      field: 'title',
      headerName: 'Book Title',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
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
      headerName: 'Total Quantity',
      flex: 1,
      align: 'center',
      headerAlign: 'center'
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
      const response = await axios.get('http://localhost:4300/user/bookManagement');
      console.log('response <<<<<>>>>>>>> : ', response.data);
      console.log('image url : ', `http://localhost:4300/${response.data.BookManagement[0].upload_Book}`);

      const fetchedData = response?.data?.BookManagement?.map((item) => ({
        id: item._id,
        bookName: item.bookName,
        upload_Book: item.upload_Book,
        title: item.title,
        publisherName: item.publisherName,
        author: item.author,
        quantity: item.quantity || 0
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
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`http://localhost:4300/user/editBook/${editData.id}`, editData);
      console.log('Data', response);
      const updatedBook = response.data;
      setData((prevData) => prevData.map((item) => (item.id === updatedBook.id ? updatedBook : item)));
      setEditData(null);
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
      console.log('delete API...');

      await axios.delete(`http://localhost:4300/user/deleteBook/${bookToDelete}`);
      setData((prevData) => prevData.filter((book) => book.id !== bookToDelete));
      setOpenDeleteDialog(false);
      setBookToDelete(null);
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
      console.log('Parsed Excel Data:', data);
    };
    reader.readAsBinaryString(file);
  };

  const handleBulkUpload = async () => {
    try {
      if (!excelData || excelData.length === 0) {
        alert('No data to upload');
        return;
      } 
 
      console.log('formData>>>>>>', excelData);
      const response = await axios.post('http://localhost:4300/user/addManyBooks', excelData); 
      alert(response.data.message);
    } catch (error) {
      console.error('Error uploading data:', error);
      alert('Error uploading data');
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
          <Breadcrumbs aria-label="breadcrumb">
            <Link href="/" underline="hover" color="inherit" onClick={handleClick} sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ mr: 0.5, color: '#6a1b9a' }} />
            </Link>
            <Link href="/account-profile" underline="hover" color="inherit" onClick={handleClick}>
              <h4>Books Management</h4>
            </Link>
          </Breadcrumbs>

          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => setOpenBulkUploadDialog(true)}>
              Bulk Upload
            </Button>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              Add New Book
            </Button>
          </Stack>
        </Box>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}></Stack>
        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', paddingTop: '15px' }}>
              <DataGrid
                rows={data}
                columns={columns}
                checkboxSelection
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
              />
              <TextField
                label="Book Title"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Publisher Name"
                value={editData.publisherName}
                onChange={(e) => setEditData({ ...editData, publisherName: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Author Name"
                value={editData.author}
                onChange={(e) => setEditData({ ...editData, author: e.target.value })}
                fullWidth
                margin="normal"
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
          <Box p={3}>
            <Typography variant="h6">Upload Excel File</Typography>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            <Button variant="contained" color="primary" onClick={handleBulkUpload} sx={{ mt: 2 }}>
              Upload Data
            </Button>
          </Box>
        </Dialog>
      </Container>
    </>
  );
};

export default Lead;
