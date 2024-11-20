import { useState, useEffect } from 'react';
import { Stack, Button, Container, Typography, Box, Card, Dialog, TextField } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Iconify from '../../ui-component/iconify';
import TableStyle from '../../ui-component/TableStyle';
import AddLead from './vendor.js';
import axios from 'axios';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const PolicyManagement = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const columns = [
    {
      field: 'companyName',
      headerName: 'Company Name',
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize'
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
    },
    {
      field: 'cityName',
      headerName: 'City',
      flex: 1
    },
    {
      field: 'date',
      headerName: 'Date',
      flex: 1
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone Number',
      flex: 1
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:4300/user/venderManagement');
      const fetchedData = response?.data?.VenderManagement?.map((item) => ({
        id: item._id,
        companyName: item.companyName,
        email: item.email,
        cityName: item.cityName,
        date: formatDate(item.date),
        phoneNumber: item.phoneNumber,
        address: item.address
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
      const response = await axios.put(`http://localhost:4300/user/editVender/${editData.id}`, editData);
      const updatedVender = response.data;
      setData((prevData) => prevData.map((item) => (item.id === updatedVender.id ? updatedVender : item)));
      setEditData(null);
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:4300/user/deleteVender/${bookToDelete}`);

      setData((prevData) => prevData.filter((item) => item.id !== bookToDelete));
      setOpenDeleteDialog(false);
      setBookToDelete(null);
    } catch (error) {
      console.error('Error deleting vendor:', error);
    }
  };

  const cancelDelete = () => {
    setOpenDeleteDialog(false);
    setBookToDelete(null);
  };
  const handleDelete = (id) => {
    setBookToDelete(id);
    setOpenDeleteDialog(true);
  };

  return (
    <>
      <AddLead open={openAdd} fetchData={fetchData} handleClose={handleCloseAdd} />
      <Container>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h4">Vendor Management</Typography>
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
                label="Company Name"
                value={editData.companyName}
                onChange={(e) => setEditData({ ...editData, companyName: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="City Name"
                value={editData.cityName}
                onChange={(e) => setEditData({ ...editData, cityName: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Phone Number"
                value={editData.phoneNumber}
                onChange={(e) => setEditData({ ...editData, phoneNumber: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Address"
                value={editData.address}
                onChange={(e) => setEditData({ ...editData, address: e.target.value })}
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

export default PolicyManagement;
