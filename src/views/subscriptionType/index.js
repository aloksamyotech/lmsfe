import { useState, useEffect } from 'react';
import { Stack, Button, Container, Typography, Box, Card, Dialog, TextField } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
// import AddLead from './AddBooks.js';
import axios from 'axios';

import { Breadcrumbs, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddSubscription from './addSubscriptionType';

const SubscriptType = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

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
      field: 'title',
      headerName: 'Title',
      flex: 1,
      
      align: 'center',
      headerAlign: 'center',
      cellClassName: 'name-column--cell name-column--cell--capitalize'
    },

    {
      field: 'amount',
      headerName: 'Amount',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize',
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'discount',
      headerName: 'Discount',
      flex: 1,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'numberOfDays',
      
      align: 'center',
      headerAlign: 'center',
      headerName: 'Number Of Days',
      flex: 1
    },

    {
      field: 'action',
      headerName: 'Action',
      
      align: 'center',
      headerAlign: 'center',
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
      const response = await axios.get('http://localhost:4300/user/getSubscriptionType');
      // console.log('response : ', response.data.BookManagement[0].upload_Book);
      // console.log('image url : ', `http://localhost:4300/${response.data.BookManagement[0].upload_Book}`);
      console.log('response>>>>>>>>>', response);

      const fetchedData = response?.data?.SubscriptionType?.map((item) => ({
        id: item._id,
        title: item.title,
        amount: item.amount,
        discount: item.discount,
        desc: item.desc,
        numberOfDays: item.numberOfDays
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
      const response = await axios.put(`http://localhost:4300/user/editSubscriptionType/${editData.id}`, editData);
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

      await axios.delete(`http://localhost:4300/user/deleteSubscriptionType/${bookToDelete}`);
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
      <AddSubscription open={openAdd} fetchData={fetchData} handleClose={handleCloseAdd} />
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
              <h4>Subscription Type</h4>
            </Link>
          </Breadcrumbs>

          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              Add Subscription
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
              <Typography variant="h6">Edit Subscription</Typography>
              <TextField
                label="Title"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Amount"
                value={editData.amount}
                onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Discount"
                value={editData.discount}
                onChange={(e) => setEditData({ ...editData, discount: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Number Of Days"
                value={editData.numberOfDays}
                onChange={(e) => setEditData({ ...editData, numberOfDays: e.target.value })}
                fullWidth
                margin="normal"
              />
              {/* <TextField
                label="Return Price"
                value={editData.returnPrice}
                onChange={(e) => setEditData({ ...editData, returnPrice: e.target.value })}
                fullWidth
                margin="normal"
              /> */}
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

export default SubscriptType;
