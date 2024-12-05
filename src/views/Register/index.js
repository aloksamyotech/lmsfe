import React, { useState, useEffect } from 'react';
import { Container, Stack, Typography, Button, Box, Card, Dialog, TextField } from '@mui/material';
import { Icon } from '@iconify/react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import AddRegister from './Addcalls.js';
import TableStyle from '../../ui-component/TableStyle';
import axios from 'axios';
import AddRegister from './Addregister';
import View from 'views/view/view';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Breadcrumbs, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { toast } from 'react-toastify';

// const callData = [
//   {
//     id: 1,
//     student_id: 'Task Testing',
//     student_Name: 'HRitik',
//     email: 'test@example.com',
//     mobile_Number: '1111111111',
//     register_Date: '10/02/2015',
//     status: 'Active',
//     action: 'Inactive'
//   }
// ];

const Call = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openFavoriteDialog, setOpenFavoriteDialog] = useState(false);
  const [favoriteStudent, setFavoriteStudent] = useState(null);
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
    // {
    //   field: 'student_id',
    //   headerName: 'Student ID',
    //   flex: 1,
    //   cellClassName: 'name-column--cell name-column--cell--capitalize'
    // },

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
    },
    // {
    //   field: 'subscription',
    //   headerName: 'Subscription',
    //   // align: 'center',
    //   // headerAlign: 'center',
    //   flex: 1,
    //   renderCell: (params) => (
    //     <div>
    //       <Button
    //         onClick={() => handleSubscription(params.row)}
    //         style={{
    //           color: params.row.subscription ? 'green' : 'orange',
    //           margin: '-9px',
    //           fontSize: '21px',
    //           padding: '10px'
    //         }}
    //       >
    //         <Icon icon="mdi:bell" />
    //       </Button>
    //     </div>
    //   )
    // },
    {
      field: 'action',
      headerName: 'Action',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      renderCell: (params) => (
        <div>
          <Button onClick={() => handleView(params.row)} color="secondary" style={{ margin: '-15px' }}>
            <VisibilityIcon />
          </Button>
          <Button color="primary" onClick={() => handleEdit(params.row)} style={{ margin: '-9px' }}>
            <EditIcon />
          </Button>

          <Button
            onClick={() => handleFavorite(params.row)}
            style={{ color: params.row.favorite ? 'red' : 'gray', margin: '-9px', fontSize: '21px', padding: '10px' }}
          >
            <Icon icon="mdi:heart" />
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
      console.log('Data');

      const response = await axios.get('http://localhost:4300/user/registerManagement');
      console.log('data API------------', response);
      const fetchedData = response?.data?.RegisterManagement?.map((item) => ({
        id: item._id,
        student_id: item.student_id,
        student_Name: item.student_Name,
        email: item.email,
        mobile_Number: item.mobile_Number,
        register_Date: formatDate(item.register_Date),
        favorite: item.favorite || false,
        subscription: item.subscription || false
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

  const handleEdit = (register) => {
    setEditData(register);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`http://localhost:4300/user/editRegister/${editData.id}`, editData);
      console.log('Data', response);

      const updatedRegister = response.data;
      setData((prevData) => prevData.map((item) => (item.id === updatedRegister.id ? updatedRegister : item)));
      setEditData(null);
      fetchData();
    } catch (error) {
      console.error('Error updating Register:', error);
    }
  };
  const handleDelete = (id) => {
    setBookToDelete(id);
    setOpenDeleteDialog(true);
    Call();
  };

  const confirmDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4300/user/deleteRegister/${bookToDelete}`);
      setData((prevData) => prevData.filter((register) => register.id !== bookToDelete));
      cancelDelete();
    } catch (error) {
      console.error('Error deleting Register:', error);
    }
  };
  const cancelDelete = () => {
    setOpenDeleteDialog(false);
    setBookToDelete(null);
  };

  const handleView = (row) => {
    console.log('Viewing', row);
    // window.location.href = `/dashboard/view/`;
    window.location.href = `/dashboard/view/${row.id}`;
    const fetchStudent = async () => {
      try {
        console.log('Student');

        const response = await axios.get('/user/viewBookAllotmentUser/:id');
        console.log('data API------------', response);
        const fetchedData = response?.data?.RegisterManagement?.map((item) => ({
          id: item._id,
          student_id: item.student_id,
          student_Name: item.student_Name,
          email: item.email,
          mobile_Number: item.mobile_Number,
          register_Date: formatDate(item.register_Date)
        }));
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchStudent();
  };

  // const handleView = (row) => {
  //   navigate(`/dashboard/view/${row._id}`, { state: { bookingData: row } });
  // };

  const handleFavorite = async (student) => {
    console.log(`click on like`);
    try {
      console.log('Student ID', student.id);

      const response = await axios.post(`http://localhost:4300/user/markFavorite/${student.id}`);
      console.log('Favorite response-------', response);
      const updatedStudent = response.data.student;

      setData((prevData) => prevData.map((item) => (item.id === updatedStudent.id ? updatedStudent : item)));

      if (response) {
        fetchData();
      }
      if (response?.data?.student?.favorite == true) {
        toast.success('add to Favorite successfully');
        // cancelFavorite();
      } else {
        toast.error('Remove to Favorite successfully');
      }
    } catch (error) {
      console.error('Error marking as favorite:', error);
    }

    // setFavoriteStudent(student);
    // confirmFavorite();
    // fetchStudent();
    // fetchData();
    // setOpenFavoriteDialog(true);
  };

  // const confirmFavorite = async () => {
  //   try {
  //     const response = await axios.post(`http://localhost:4300/user/markFavorite/${favoriteStudent.id}`);
  //     const updatedStudent = response.data.student;
  //     setData((prevData) => prevData.map((item) => (item.id === updatedStudent.id ? updatedStudent : item)));
  //   } catch (error) {
  //     console.error('Error marking as favorite:', error);
  //   }
  // };

  // const confirmFavorite = async () => {
  //   try {
  //     await axios.post(`http://localhost:4300/user/markFavorite/${favoriteStudent.id}`);
  //     setData((prevData) => prevData.map((item) => (item.id === favoriteStudent.id ? { ...item, favorite: true } : item)));
  //     cancelFavorite();
  //   } catch (error) {
  //     console.error('Error marking favorite:', error);
  //   }
  // };

  const cancelFavorite = () => {
    setOpenFavoriteDialog(false);
    setFavoriteStudent(null);
  };
  const handleSubscription = async (row) => {
    try {
      console.log('handleSubscription---------');

      const updatedSubscription = !row.subscription;
      const response = await axios.post(`http://localhost:4300/user/markSubscription/${row.id}`, {
        subscription: updatedSubscription
      });
      console.log('response', response);

      if (response.status === 200) {
        setData((prevData) => prevData.map((item) => (item.id === row.id ? { ...item, subscription: updatedSubscription } : item)));
        // toast.success(updatedSubscription ? 'Subscribed successfully!' : 'Unsubscribed successfully!');
      }
      if (response?.data?.student?.subscription == true) {
        toast.success('add to Subscription successfully');
      } else {
        toast.error('Remove to Subscription successfully');
      }
    } catch (error) {
      console.error('Error toggling subscription:', error);
    }
  };
  return (
    <>
      <AddRegister open={openAdd} fetchData={fetchData} handleClose={handleCloseAdd} />
      <Container>
        {/* <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h4">Register Students</Typography>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Button variant="contained" startIcon={<Icon icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              New Register Student
            </Button>
          </Stack>
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
              <h4>Students Management</h4>
            </Link>
          </Breadcrumbs>

          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Button variant="contained" startIcon={<Icon icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              Register Student
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
              <Typography variant="h6">Edit Register</Typography>
              {/* <TextField
                label="Student ID"
                value={editData.student_id}
                onChange={(e) => setEditData({ ...editData, student_id: e.target.value })}
                fullWidth
                margin="normal"
              /> */}
              <TextField
                label="Student Name"
                value={editData.student_Name}
                onChange={(e) => setEditData({ ...editData, student_Name: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label=" Email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Mobile Number"
                value={editData.mobile_Number}
                onChange={(e) => setEditData({ ...editData, mobile_Number: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Register Date"
                value={editData.register_Date}
                onChange={(e) => setEditData({ ...editData, register_Date: e.target.value })}
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
        {/* <Dialog open={openFavoriteDialog} onClose={cancelFavorite}>
          <Box p={3}>
            <Typography variant="h6">Are you sure you want to mark {favoriteStudent?.student_Name} as a favorite?</Typography>
            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={3}>
              <Button onClick={cancelFavorite} variant="outlined" color="secondary">
                Cancel
              </Button>
              <Button onClick={confirmFavorite} variant="contained" color="primary">
                OK
              </Button>
            </Stack>
          </Box>
        </Dialog> */}
      </Container>
    </>
  );
};

export default Call;
