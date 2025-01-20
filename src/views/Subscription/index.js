import { useState, useEffect } from 'react';
// @mui
import { Stack, Grid, Dialog, TextField, DialogActions, DialogContent, DialogTitle, Typography, Divider, Avatar } from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';

import axios from 'axios';
import Iconify from '../../ui-component/iconify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { Breadcrumbs, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { Box, Container } from '@mui/system';

// ----------------------------------------------------------------------

const Contact = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  let passKey = '1234';
  let pin = '1234';
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:4300/user/getSubscription');
      console.log('response>>>>>>>>>>', response);
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

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  const randomImages = [
    'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp',
    'https://randomuser.me/api/portraits/men/1.jpg',
    'https://randomuser.me/api/portraits/women/1.jpg',
    'https://placekitten.com/200/300',
    'https://placeimg.com/200/200/people'
  ];

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * randomImages.length);
    return randomImages[randomIndex];
  };

  return (
    <>
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
              <h4>Subscription</h4>
            </Link>
          </Breadcrumbs>
        </Box>

        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}></Stack>
        <Box
          sx={{
            backgroundColor: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            height: 'auto',
            justifyContent: 'space-between'
          }}
        >
          {data.length > 0 ? (
            data.map((student) => (
              <Grid
                container
                key={student.id}
                xs={12}
                md={5}
                lg={3.5}
                sx={{
                  borderRadius: '10px',
                  background: '#F8FAFC',
                  padding: '10px',
                  margin: '5px',
                  border: '1px solid #E3E8EF',
                  '&:hover': { border: '1px solid #2196F3' }
                }}
              >
                <Grid item xs={4}>
                  <Avatar src={getRandomImage()} sx={{ borderRadius: '10px', height: '90px', width: '70px' }} />
                </Grid>
                <Grid item xs={8}>
                  <Grid item xs={12}>
                    <Typography variant="h4" sx={{ fontSize: '21px' }}>
                      {student.student_Name}
                    </Typography>
                  </Grid>
                  <Divider />
                  <Grid item>
                    <Typography sx={{ fontSize: '10px', marginTop: '3px' }}>{student.register_Date}</Typography>
                  </Grid>
                  <Grid item xs={12} sx={{ marginTop: '10px' }} direction="row">
                    <Grid container>
                      <Grid item xs={8}>
                        <Typography variant="h6" sx={{ marginTop: '10px', marginLeft: '10px' }}>
                          {passKey ? pin : hidepass}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <IconButton color="secondary" variant="contained" size="small" sx={{}}>
                          {passKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </Grid>
                    </Grid>
                    <Divider />
                  </Grid>
                </Grid>
                <Grid item xs={12} sx={{ marginTop: '10px' }}>
                  <Grid item sx={{ color: '#2A2A2A', fontWeight: '500' }}>
                    Access Level: Visitor
                  </Grid>
                  <Grid item sx={{ fontSize: '12px' }}></Grid>
                </Grid>
              </Grid>
            ))
          ) : (
            <Typography>No data available</Typography>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Contact;
