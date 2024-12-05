import { useState, useEffect } from 'react';
// @mui
import {
  Stack,
  Button,
  Container,
  Typography,
  Box,
  Card,
  Dialog,
  TextField,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import Iconify from '../../ui-component/iconify';
import AddContact from './addContact.js';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { Breadcrumbs, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

// ----------------------------------------------------------------------

const Contact = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);

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
      field: 'email',
      headerName: 'Email',
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize'
    },
    {
      field: 'student_Name',
      headerName: 'Student Name',
      flex: 1
    },
    {
      field: 'mobile_Number',
      headerName: 'Mobile Number',
      flex: 1
    },
    {
      field: 'register_Date',
      headerName: 'Register Date',
      flex: 1
    }
    // {
    //   field: 'action',
    //   headerName: 'Action',
    //   flex: 1,
    //   renderCell: (params) => (
    //     <div>
    //       {/* <Button color="primary" onClick={() => handleEdit(params.row)} style={{ margin: '-9px' }}>
    //         <EditIcon />
    //       </Button> */}
    //       <Button color="secondary" onClick={() => handleDelete(params.row.id)} style={{ margin: '-9px' }}>
    //         <DeleteIcon />
    //       </Button>
    //     </div>
    //   )
    // }
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
      const response = await axios.get('http://localhost:4300/user/getMarkFavorite');
      console.log('response', response);
      const fetchedData = response?.data?.students?.map((item) => ({
        id: item._id,
        student_id: item.student_id,
        student_Name: item.student_Name,
        email: item.email,
        mobile_Number: item.mobile_Number,
        register_Date: formatDate(item.register_Date)
      }));

      setData(fetchedData);
      console.log('fetchedData', fetchedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleEdit = (contact) => {
    setEditData(contact);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`http://localhost:4300/user/editContact/${editData.id}`, editData);
      const updatedContact = response.data;
      setData((prevData) => prevData.map((item) => (item.id === updatedContact.id ? updatedContact : item)));
      setEditData(null);
      fetchData();
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const handleDelete = (contact) => {
    setContactToDelete(contact);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (contactToDelete) {
        await axios.delete(`http://localhost:4300/user/deleteContact/${contactToDelete}`);
        setData((prevData) => prevData.filter((item) => item.id !== contactToDelete));
        setContactToDelete(null);
      }
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting contact:', error);
      setOpenDeleteDialog(false);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  return (
    <>
      <AddContact open={openAdd} fetchData={fetchData} handleClose={handleCloseAdd} />
      <Container>
        {/* <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h4">Favorite Contact </Typography>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}></Stack>
        </Stack> */}
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
              <h4>Favorite Contact</h4>
            </Link>
          </Breadcrumbs>
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

        <Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
          <Box p={3}>
            <Typography variant="h6">Are you sure you want to delete this contact?</Typography>
            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
              <Button onClick={handleCancelDelete} variant="outlined" color="secondary">
                Cancel
              </Button>
              <Button onClick={handleConfirmDelete} variant="contained" color="primary">
                OK
              </Button>
            </Stack>
          </Box>
        </Dialog>
      </Container>
    </>
  );
};

export default Contact;
