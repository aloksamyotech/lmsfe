import React, { useState, useEffect } from 'react';
import { Card, Container, Grid, Typography, Box, FormLabel, TextField, Button } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Formik, Form } from 'formik';
import moment from 'moment';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Breadcrumbs, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { bookAllotmentReport } from 'core/helperFurtion';
import { url } from 'core/url'; 
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
  ];
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const handleSubmit = async (values) => {
    const response = await bookAllotmentReport(`${url.allotmentManagement.bookAllotmentReport}${values.startDate}/${values.endDate}`);

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
