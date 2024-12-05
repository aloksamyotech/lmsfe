import React, { useState, useEffect } from 'react';
import { Container, Avatar, Typography, Paper, Link, Breadcrumbs, Box, Card, Stack } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { Icon } from '@iconify/react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import TableStyle from '../../ui-component/TableStyle';
import axios from 'axios';
import AddRegister from 'views/Register/Addregister';

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

const View = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [currentUrl, setCurrentUrl] = useState('');
  const [id, setId] = useState(null);
  const [allData, setAllData] = useState([]);

  // Initial profile data
  const [profile, setProfile] = useState({
    student_Name: '',

    email: '',
    mobile_Number: '',
    register_Date: ''
    // address: ''
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Form Data Submitted:', formData);
  };

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
    console.log('Breadcrumb clicked');
  };

  const columns = [
    {
      field: 'bookName',
      headerName: 'Book Name',
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize'
    },
    {
      field: 'student_Name',
      headerName: 'Student Name',
      flex: 1,
      cellClassName: 'name-column--cell--capitalize'
    },
    {
      field: 'paymentType',
      headerName: 'Payment Type',
      flex: 1
    },
    {
      field: 'bookIssueDate',
      headerName: 'Book Issue Date',
      flex: 1
    },
    {
      field: 'submissionDate',
      headerName: 'Submission Date',
      flex: 1
    }
    // {
    //   field: 'action',
    //   headerName: 'Action',
    //   flex: 1
    // }
    // renderCell: (params) => (
    //   <div>
    //     <Button color="primary" onClick={() => handleEdit(params.row)} style={{ margin: '-9px' }}>
    //       <EditIcon />
    //     </Button>
    //     <Button color="secondary" onClick={() => handleDelete(params.row.id)} style={{ margin: '-9px' }}>
    //       <DeleteIcon />
    //     </Button>
    //   </div>
    // )
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

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
    } catch (error) {
      console.error('Error updating Register:', error);
    }
  };
  const handleDelete = (id) => {
    setBookToDelete(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4300/user/deleteRegister/${id}`);
      setData((prevData) => prevData.filter((register) => register.id !== id));
    } catch (error) {
      console.error('Error deleting Register:', error);
    }
  };
  const cancelDelete = () => {
    setOpenDeleteDialog(false);
    setBookToDelete(null);
  };

  const student = {
    logoUrl: 'https://example.com/logo.png',
    Name: 'John Doe',
    Email: 'john.doe@example.com',
    Phone_Number: '+1234567890',
    Register_Date: '2024-11-18'
  };

  useEffect(() => {
    const url = window.location.href;
    console.log('Current Url', url);
    setCurrentUrl(url);

    const parts = url.split('/');
    const extractedId = parts[parts.length - 1];
    console.log('Id', extractedId);

    setId(extractedId);
    const sendIdToBackend = async () => {
      try {
        const response = await axios.get(`http://localhost:4300/user/viewBookAllotmentUser/${extractedId}`);
        // const student = response?.data?.bookAllotments?.user?.map((item) => ({
        //   // id: item._id,
        //   student_id: item.student_id,
        //   student_Name: item.student_Name,
        //   email: item.email,
        //   mobile_Number: item.mobile_Number,
        //   register_Date: formatDate(item.register_Date)
        // }));
        setAllData(response.data);

        // console.log('Backend Response:', response?.data?.user?.email);
      } catch (error) {
        console.error('Error sending ID to backend:', error);
      }
    };

    if (extractedId) {
      sendIdToBackend();
    }
  }, []);

  useEffect(() => {
    const url = window.location.href;
    console.log('Current Url', url);
    setCurrentUrl(url);

    const parts = url.split('/');
    const extractedId = parts[parts.length - 1];
    console.log('Id', extractedId);

    setId(extractedId);
    const fetchData = async () => {
      try {
        console.log('findHistoryBookAllotmentUser');

        // const response = await axios.get(`http://localhost:4300/user/findHistoryBookAllotmentUser/673b20e1b1eb688cbb03f464`);

        // const response = await axios.get(`http://localhost:4300/user/findHistoryBookAllotmentUser/:id`);

        const response = await axios.get(`http://localhost:4300/user/findHistoryBookAllotmentUser/${extractedId}`);
        console.log('findHistoryBookAllotmentUser----------', response);
        const fetchedData = response?.data?.map((item) => ({
          id: item._id,
          bookName: item.bookName,
          student_Name: item.student_Name,
          paymentType: item.paymentType,
          bookIssueDate: formatDate(item.bookIssueDate),
          submissionDate: formatDate(item.submissionDate)
        }));

        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(`http://localhost:4300/user/viewBookAllotmentUser/${extractedId}`);
  //       console.log('Student ', response);
  //       const fetchedData = response?.data?.RegisterManagement?.map((item) => ({
  //         id: item._id,
  //         student_id: item.student_id,
  //         student_Name: item.student_Name,
  //         email: item.email,
  //         mobile_Number: item.mobile_Number,
  //         register_Date: formatDate(item.register_Date)
  //       }));
  //       setData(fetchedData);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   const fetchStudentData = async () => {
  //     try {
  //       console.log('Student Data........');

  //       const response = await axios.get(`http://localhost:4300/user/viewBookAllotmentUser/${extractedId}`);
  //       console.log('Student ', response);

  //       setStudentData(response.data);
  //     } catch (error) {
  //       console.error('Error fetching student data:', error);
  //     }
  //   };

  //   fetchData();
  //   fetchStudentData();
  // }, []);

  console.log(`allData`, allData?.user?.email);
  return (
    <>
      <Box
        sx={{
          backgroundColor: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          height: '50px',
          width: '96%',
          marginBottom: '-6px',
          marginLeft: '2%'
        }}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Link href="/" underline="hover" color="inherit" onClick={handleClick} sx={{ display: 'flex', alignItems: 'center' }}>
            <HomeIcon sx={{ mr: 0.5, color: '#6a1b9a' }} />
          </Link>
          <Link href="/account-profile" underline="hover" color="inherit" onClick={handleClick}>
            <h4>Student Profile</h4>
          </Link>
        </Breadcrumbs>
      </Box>
      <AddRegister open={openAdd} handleClose={handleCloseAdd} />
      <Container>
        <Card></Card>
        <Paper
          elevation={4}
          style={{
            padding: '20px',
            display: 'flex',
            // alignItems: 'center',
            maxWidth: '500px',
            margin: '20px',
            // marginRight: '-5%'
          }}
        >
          {/* Student Logo / Avatar */}
          <Avatar
            src={student.logoUrl}
            alt={student.student_Name}
            sx={{
              width: 100,
              height: 100,
              marginRight: '20px'
            }}
          />

          {/* Student Details */}
          <Box sx={{ lineHeight: 2 }}>
            <Typography variant="h5" gutterBottom>
              {allData?.user?.student_Name}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>Email -: {allData?.user?.email}</strong>
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>Phone Number -: {allData?.user?.mobile_Number}</strong>
            </Typography>
            <Typography variant="body1" color="textSecondary">
              <strong>Register Date -: {formatDate(allData?.user?.register_Date)}</strong>
            </Typography>
          </Box>
        </Paper>
        <Box
          sx={{
            backgroundColor: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            height: '50px',
            marginBottom: '-18px'
          }}
        >
          <Breadcrumbs aria-label="breadcrumb">
            <Link href="/" underline="hover" color="inherit" onClick={handleClick} sx={{ display: 'flex', alignItems: 'center' }}>
              <HomeIcon sx={{ mr: 0.5, color: '#6a1b9a' }} />
            </Link>
            <Link href="/account-profile" underline="hover" color="inherit" onClick={handleClick}>
              <h4>Student Allotted Books</h4>
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
      </Container>
    </>
  );
};

export default View;
