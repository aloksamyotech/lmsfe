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
import { toast } from 'react-toastify';
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

  const [openFavoriteDialog, setOpenFavoriteDialog] = useState(false);
  const [favoriteStudent, setFavoriteStudent] = useState(null);

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
      headerName: 'Student Email',
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
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Button
            onClick={() => handleFavorite(params.row.id)}
            variant="contained"
            color="error"
            style={{ padding: '5px 10px', fontSize: '14px' }}
          >
            Remove
          </Button>
        </Box>
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

  const handleFavorite = async (student) => {
    console.log(`click on like`);
    try {
      console.log('Student ID', student);

      const response = await axios.post(`http://localhost:4300/user/markFavorite/${student}`);
      console.log('Favorite response>>>>>>>-------', response);
      const updatedStudent = response.data.student;

      if (response) {
        fetchData();
      } else {
        toast.error('Remove to Favorite successfully');
      }
    } catch (error) {
      console.error('Error marking as favorite:', error);
    }
    handleClick(); 
  };
  return (
    <>
      <AddContact open={openAdd} fetchData={fetchData} handleClose={handleCloseAdd} />
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
              <h4>Favorite Students</h4>
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
