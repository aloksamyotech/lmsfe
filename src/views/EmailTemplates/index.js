// /* eslint-disable react/prop-types */
// /* eslint-disable react-hooks/exhaustive-deps */
// import { Link } from 'react-router-dom';
// // @mui
// import { Stack, Button, Container, Typography, Card, Box } from '@mui/material';
// import TableStyle from '../../ui-component/TableStyle';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
// import { Grid, FormLabel, TextField, Stack, Button, Container, Typography, Card, Box } from '@mui/material';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';

// import Iconify from '../../ui-component/iconify';
// // import AddEmailTemplates from './AddTemplates';

// // ----------------------------------------------------------------------

// const documentData = [
//   // {
//   //   id: 1,
//   //   templatesName: 'Heading',
//   //   createdOn: '09/01/2024',
//   //   modifiedOn: '09/01/2024',
//   //   createdBy: 'user '
//   // }
// ];
// const EmailTemplates = () => {
//   const columns = [
//     // {
//     //   field: 'templatesName',
//     //   headerName: 'Templates Name',
//     //   flex: 1,
//     //   cellClassName: 'name-column--cell name-column--cell--capitalize'
//     // },
//     // {
//     //   field: 'createdOn',
//     //   headerName: 'Created On',
//     //   flex: 1,
//     //   cellClassName: 'name-column--cell--capitalize'
//     // },
//     // {
//     //   field: 'modifiedOn',
//     //   headerName: 'ModifiedOn',
//     //   flex: 1
//     // },
//     // {
//     //   field: 'createdBy',
//     //   headerName: 'Created By',
//     //   flex: 1
//     // }
//   ];
//   return (
//     <>
//       {/* <AddEmailTemplates /> */}
//       <Container>
//         <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
//           <Typography variant="h4"> Report Lists</Typography>
//           <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
//             {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
//               <Link to="/dashboard/emailtemplate/addTemplates" style={{ textDecoration: 'none', color: 'white' }}>
//                 New Template
//               </Link>
//             </Button> */}
//              <Grid item xs={12} sm={6} md={6}>
//                 <FormLabel>Register Date</FormLabel>
//                 <TextField
//                   id="register_Date"
//                   name="register_Date"
//                   size="small"
//                   type="datetime-local"
//                   fullWidth
//                   value={formik.values.register_Date}
//                   onChange={formik.handleChange}
//                   error={formik.touched.register_Date && Boolean(formik.errors.register_Date)}
//                   helperText={formik.touched.register_Date && formik.errors.register_Date}
//                 />
//               </Grid>
//           </Stack>
//         </Stack>
//         <TableStyle>
//           <Box width="100%">
//             <Card style={{ height: '600px', paddingTop: '15px' }}>
//               <DataGrid
//                 rows={documentData}
//                 columns={columns}
//                 checkboxSelection
//                 getRowId={(row) => row.id}
//                 slots={{ toolbar: GridToolbar }}
//                 slotProps={{ toolbar: { showQuickFilter: true } }}
//               />
//             </Card>
//           </Box>
//         </TableStyle>
//       </Container>
//     </>
//   );
// };

// export default EmailTemplates;

import React, { useState, useEffect } from 'react';
import { Card, Container, Grid, Typography, Box, FormLabel, TextField, Button } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Formik, Form } from 'formik';
import moment from 'moment';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Breadcrumbs, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
// import { allBooking } from 'api/apis';
// import { url } from 'api/url';
const EmailTemplates = () => {
  const [allBookAllotmentData, setAllBookAllotmentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const today = moment().format('YYYY-MM-DD');
  const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');

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
    // {
    //   field: 'createdAt',
    //   headerName: 'Book Allotment Date',
    //   flex: 0.7,
    //   valueFormatter: ({ value }) => moment(value).format('MM-DD-YYYY')
    // },
    // { field: '_id', headerName: 'Booking ID', flex: 1 },
    // { field: 'assignedTo', headerName: 'Assigned To', flex: 1 },
    // { field: 'customerName', headerName: 'Customer Name', flex: 1 },
    // {
    //   field: 'serviceStatus',
    //   headerName: 'Service Status',
    //   flex: 0.7,
    //   renderCell: (params) => {
    //     const statusColors = {
    //       Accepted: '#90EE90',
    //       Pending: '#66CDAA',
    //       Processing: '#4CAE4C',
    //       Completed: '#36D962'
    //     };
    //     const backgroundColor = statusColors[params.value] || statusColors.default;
    //     return (
    //       <Box
    //         sx={{
    //           width: '70px',
    //           height: '30px',
    //           backgroundColor: backgroundColor,
    //           color: 'white',
    //           padding: '4px',
    //           borderRadius: '6px',
    //           textAlign: 'center',
    //           display: 'flex',
    //           justifyContent: 'center',
    //           alignItems: 'center',
    //           overflow: 'hidden',
    //           textOverflow: 'ellipsis'
    //         }}
    //       >
    //         {params.value}
    //       </Box>
    //     );
    //   }
    // }
  ];
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const handleSubmit = async (values) => {
    const response = await axios.get(`http://64.227.130.216:4300/user/bookAllotmentReport/${values.startDate}/${values.endDate}`);

    const finalData = response.data.map((item, index) => {
      return {
        id: item._id,
        bookName: item.bookName,
        student_Name: item.student_Name,
        paymentType: item.paymentType,
        bookIssueDate: formatDate(item.bookIssueDate),
        submissionDate: formatDate(item.submissionDate)
      };
    });
    console.log(`finalData`, finalData);

    setAllBookAllotmentData(finalData);
  };
  useEffect(() => {
    handleSubmit({ startDate: yesterday, endDate: today });
  }, []);
  console.log(`allBookAllotmentData`, allBookAllotmentData);

  return (
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
          marginBottom: '16px'
        }}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Link href="/" underline="hover" color="inherit" onClick={handleClick} sx={{ display: 'flex', alignItems: 'center' }}>
            <HomeIcon sx={{ mr: 0.5, color: '#6a1b9a' }} />
          </Link>
          <Link href="/account-profile" underline="hover" color="inherit" onClick={handleClick}>
            <h4> Book Allotment Report</h4>
          </Link>
        </Breadcrumbs>
      </Box>

      <Card style={{ paddingTop: '10px' }}>
        <Formik 
          initialValues={{
            startDate: yesterday,
            endDate: today
          }}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange }) => (
            <Form>
              <Box width="100%" padding="30px">
                <Typography style={{ marginBottom: '15px' }} variant="h3">
                  Choose Date Range
                </Typography>
                <Grid container rowSpacing={3} columnSpacing={{ xs: 0, sm: 5, md: 4 }}>
                  <Grid item xs={12} sm={4} md={4}>
                    <FormLabel>Start Date</FormLabel>
                    <TextField name="startDate" type="date" size="small" fullWidth value={values.startDate} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <FormLabel>End Date</FormLabel>
                    <TextField name="endDate" type="date" size="small" fullWidth value={values.endDate} onChange={handleChange} />
                  </Grid>
                  <Grid item xs={12} sm={4} md={4}>
                    <FormLabel></FormLabel>
                    <Button
                      style={{
                        maxWidth: '200px',
                        maxHeight: '40px',
                        minWidth: '100px',
                        minHeight: '30px',
                        marginTop: '21px'
                      }}
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Submitting...' : 'Submit'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Form>
          )}
        </Formik>
      </Card>
      {loading ? (
        <Typography variant="h6" color="textSecondary" align="center" mt={4}>
          Loading...
        </Typography>
      ) : allBookAllotmentData.length > 0 ? (
        <Card style={{ height: '600px', paddingTop: '15px', marginTop: '30px' }}>
          <DataGrid
            rows={allBookAllotmentData}
            columns={columns}
            checkboxSelection
            getRowId={(row) => row.id}
            slots={{ toolbar: GridToolbar }}
            slotProps={{ toolbar: { showQuickFilter: true } }}
          />
        </Card>
      ) : (
        <Typography variant="h6" color="textSecondary" align="center" mt={4}>
          No data available for the selected range.
        </Typography>
      )}
    </Container>
  );
};

export default EmailTemplates;
