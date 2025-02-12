import { useState, useEffect } from 'react';
import { Stack, Button, Container, Typography, Box, Card, Dialog, TextField } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import AddLead from './AddBooks.js';
import axios from 'axios';

const Lead = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const columns = [
    {
      field: 'bookName',
      headerName: 'Book Name',
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize'
    },
    {
      field: 'bookTitle',
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
      field: 'authorName',
      headerName: 'Author Name',
      flex: 1
    },
    {
      field: 'returnPrice',
      headerName: 'Return Price',
      flex: 1
    },
    {
      field: 'quantity',
      headerName: 'Available Quantity',
      flex: 1
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => (
        <div>
          <Button variant="contained" color="primary" style={{ marginRight: 10 }} onClick={() => handleEdit(params.row)}>
            Edit
          </Button>
          <Button variant="contained" color="secondary" onClick={() => handleDelete(params.row.id)}>
            Delete
          </Button>
        </div>
      )
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://64.227.130.216:4300/user/bookManagement');
        const fetchedData = response?.data?.BookManagement?.map((item) => ({
          id: item._id,
          bookName: item.bookName,
          bookTitle: item.bookTitle,
          publisherName: item.publisherName,
          authorName: item.authorName,
          returnPrice: item.returnPrice,
          quantity: item.quantity
        }));
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleEdit = (book) => {
    setEditData(book);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`http://64.227.130.216:4300/user/editBook/${editData.id}`, editData);
      const updatedBook = response.data;
      setData((prevData) => prevData.map((item) => (item.id === updatedBook.id ? updatedBook : item)));
      setEditData(null);
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const handleDelete = (id) => {
    setBookToDelete(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://64.227.130.216:4300/user/deleteBook/${bookToDelete}`);
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

  return (
    <>
      <AddLead open={openAdd} handleClose={handleCloseAdd} />
      <Container>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h4">Books Management</Typography>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              Add New Book
            </Button>
          </Stack>
        </Stack>
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
                value={editData.bookTitle}
                onChange={(e) => setEditData({ ...editData, bookTitle: e.target.value })}
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
                value={editData.authorName}
                onChange={(e) => setEditData({ ...editData, authorName: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Return Price"
                value={editData.returnPrice}
                onChange={(e) => setEditData({ ...editData, returnPrice: e.target.value })}
                fullWidth
                margin="normal"
              />
              <Button onClick={handleSaveEdit} variant="contained" color="primary">
                Save
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
      </Container>
    </>
  );
};

export default Lead;
