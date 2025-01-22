/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
// @mui
import { Stack, Button, Container, Typography, Box, Card, Dialog, TextField } from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect } from 'react';
import axios from 'axios';
// import {useState} from 'react';

import Iconify from '../../ui-component/iconify';
// import AddContact from './addContact.js';

// ----------------------------------------------------------------------
 
const FinePerDay = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const columns = [
    {
      field: 'firstName',
      headerName: 'First Name',
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize'
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
    },
    {
      field: 'gender',
      headerName: 'Gender',
      flex: 1
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone Number',
      flex: 1
    },
    {
      field: 'email',
      headerName: 'Email',
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

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         console.log('useEffect-----------');

  //         const response = await axios.get('http://localhost:4300/user/contactManagement');
  //         const fetchedData = response?.data?.ContactManagement.map((item) => ({
  //           id: item._id,
  //           firstName: item.firstName,
  //           lastName: item.lastName,
  //           dateOfBirth: item.dateOfBirth,
  //           phoneNumber: item.phoneNumber,
  //           email: item.email,
  //           gender: item.gender,
  //           address: item.address
  //         }));

  //         setData(fetchedData);
  //       } catch (error) {
  //         console.error('Error fetching data:', error);
  //       }
  //     };

  //     fetchData();
  //   }, []);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleEdit = (book) => {
    setEditData(book);
  };
  //   const handleSaveEdit = async () => {
  //     try {
  //       const response = await axios.put(`http://localhost:4300/user/editContact/${editData.id}`, editData);
  //       const updatedContact = response.data;
  //       setData((prevData) => prevData.map((item) => (item.id === updatedContact.id ? updatedContact : item)));
  //       setEditData(null);
  //     } catch (error) {
  //       console.error('Error updating book:', error);
  //     }
  //   };

  //   const handleDelete = async (contact) => {
  //     try {
  //       console.log('Contact', contact);

  //       await axios.delete(`http://localhost:4300/user/deleteContact/${contact}`);
  //       console.log('Contact', contact.id);

  //       setData((prevData) => prevData.filter((item) => item.id !== contact.id));
  //     } catch (error) {
  //       console.error('Error deleting vendor:', error);
  //     }
  //   };

  return (
    <>
      {/* <AddContact open={openAdd} handleClose={handleCloseAdd} /> */}
      <Container>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h4">Manage-Fine</Typography>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              New ..
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
              <Typography variant="h6">Edit Contact</Typography>
              <TextField
                label="First Name"
                value={editData.firstName}
                onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Last Name"
                value={editData.lastName}
                onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Date Of Birth"
                value={editData.dateOfBirth}
                onChange={(e) => setEditData({ ...editData, dateOfBirth: e.target.value })}
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
                label="Email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Gender"
                value={editData.gender}
                onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
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
      </Container>
    </>
  );
};

export default FinePerDay;
