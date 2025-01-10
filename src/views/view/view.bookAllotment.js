import React, { useState, useEffect } from 'react';
import { Container, Avatar, Typography, Paper, Link, Breadcrumbs, Box, Card, Stack, Grid, Divider, CardContent } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { Icon } from '@iconify/react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import TableStyle from '../../ui-component/TableStyle';
import axios from 'axios';
import AddRegister from 'views/Register/Addregister';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
const moment = require('moment');

import EmailIcon from '@mui/icons-material/Email';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const ViewBookAllotment = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [currentUrl, setCurrentUrl] = useState('');
  const [id, setId] = useState(null);
  const [allData, setAllData] = useState([]);
  const [allbookData, setAllbookData] = useState([]);
  const [submissionDate, setSubmissionDate] = useState([]);
  const [amount, setAmount] = useState([]);

  const [profile, setProfile] = useState({
    student_Name: '',
    email: '',
    mobile_Number: '',
    register_Date: ''
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    event.preventDefault();
  };

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleEdit = (register) => {
    setEditData(register);
  };

  useEffect(() => {
    const url = window.location.href;
    setCurrentUrl(url);

    const parts = url.split('/');
    const extractedId = parts[parts.length - 1];
    console.log('getting id from dashboard', extractedId);

    setId(extractedId);
    const sendIdToBackend = async () => {
      try {
        const response = await axios.get(`http://64.227.130.216:4300/user/getBookDetailHistoryStudentId/${extractedId}`);

        console.log(`response---from all history api-->>>>`, response?.data?.allotmentDetails[0]?.bookDetails?.bookName);

        console.log(`response----->>>>`, response?.data);

        const student_Name = response?.data?.studentDetails?.student_Name;
        const mobile_Number = response?.data?.studentDetails?.mobile_Number;
        const register_Date = response?.data?.studentDetails?.register_Date;
        const email = response?.data?.studentDetails?.email;

        const upload_Book = response?.data?.allotmentDetails[0]?.bookDetails?.upload_Book;
        const bookName = response?.data?.allotmentDetails[0]?.bookDetails?.bookName;
        const publisherName = response?.data?.allotmentDetails[0]?.bookDetails?.publisherName;
        const author = response?.data?.allotmentDetails[0]?.bookDetails?.author;
        const title = response?.data?.allotmentDetails[0]?.bookDetails?.title;
        const bookIssueDate = response?.data?.allotmentDetails[0]?.bookDetails?.bookIssueDate;
        const submissionDate = response?.data?.allotmentDetails[0]?.bookDetails?.submissionDate;

        setAllData(response?.data?.studentDetails);
        setAllbookData(response?.data?.allotmentDetails);
        setAmount(response?.data?.allotmentDetails);

        const SubmissionDate = response?.data[0].submissionDate;
        console.log('Submission Date', SubmissionDate);

        console.log('student', student_Name);
        console.log('upload_Book', upload_Book);
        console.log('currentDate', currentDate);
      } catch (error) {
        console.error('Error sending ID to backend:', error);
      }
    };

    if (extractedId) {
      sendIdToBackend();
    }
  }, []);

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
            <h4>View Allotment</h4>
          </Link>
        </Breadcrumbs>
      </Box>

      <Box p={3}>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Box display="flex" gap={4}>
                <Typography variant="button" color="primary">
                  Details
                </Typography>
              </Box>
            </Box>
            <Divider />
            <Box display="flex" justifyContent="space-between" alignItems="center" padding={2} borderBottom="1px solid #e0e0e0">
              <Stack direction="row" spacing={2} alignItems="center">
                <PersonIcon color="action" />
                <Typography variant="body1" fontWeight="bold">
                  {allData?.student_Name || 'Loading...'}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PhoneIcon color="action" />
                  <Typography variant="body2">{allData?.mobile_Number || 'Loading...'}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <EmailIcon color="action" />
                  <Typography variant="body2">{allData?.email || 'Loading...'}</Typography>
                </Stack>
              </Stack>
            </Box>
            <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}></Stack>

            <Grid container spacing={3}>
              {allbookData?.map((bookDetails, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ borderRadius: '10px', background: '#F8FAFC', padding: '10px', boxShadow: 1 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Avatar
                          src={bookDetails?.upload_Book || 'Loading...'}
                          sx={{ borderRadius: '10px', height: '90px', width: '70px' }}
                        />
                      </Grid>
                      <Grid item xs={8}>
                        <Typography variant="h4" sx={{ fontSize: '21px' }}>
                          {bookDetails?.bookDetails?.bookName || 'Loading...'}
                        </Typography>
                        <Divider sx={{ marginY: '10px' }} />
                        <Typography sx={{ fontSize: '10px', marginTop: '3px' }}>
                          <strong>Title -: </strong> {bookDetails?.bookDetails?.title || 'Loading...'}
                        </Typography>
                        <Typography sx={{ fontSize: '10px', marginTop: '3px' }}>
                          <strong>Author -: </strong> {bookDetails?.bookDetails?.author || 'Loading...'}
                        </Typography>
                        <Typography sx={{ fontSize: '10px', marginTop: '3px' }}>
                          <strong>Publisher Name -: </strong> {bookDetails?.bookDetails?.publisherName || 'Loading...'}
                        </Typography>

                        <Grid container sx={{ marginTop: '10px' }}>
                          <Grid item xs={8}>
                            <Typography sx={{ fontSize: '10px', marginTop: '3px' }}>
                              <strong>Amount -: </strong> {bookDetails?.amount || 'Loading...'}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Divider sx={{ marginY: '10px' }} />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography sx={{ color: '#2A2A2A', fontWeight: '500' }}>
                          <strong>Submission Date -: </strong>{' '}
                          {moment(bookDetails?.bookDetails?.submissionDate).format('DD-MM-YYYY') || 'Loading...'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default ViewBookAllotment;
