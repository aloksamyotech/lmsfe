/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
// @mui
import { Stack, Button, Container, Typography, Card, Box } from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import Iconify from '../../ui-component/iconify';
import AddTask from './AddTask';

// ----------------------------------------------------------------------

const policyData = [
  {
    id: 1,
    bookName: 'ABcd',
    candidateName: 'Ram',
    // status: 'true',
    startDate: '12/12/2015',
    endDate: '15/12/2015'
    // note: ''
  }
];
const Task = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const columns = [
    {
      field: 'bookName',
      headerName: 'BookName',
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize'
    },
    {
      field: 'candidateName',
      headerName: 'CandidateName',
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize'
    },
    // {
    //   field: 'status',
    //   headerName: 'Status',
    //   flex: 1,
    //   cellClassName: 'name-column--cell--capitalize'
    // },
    {
      field: 'startDate',
      headerName: ' Start Date',
      flex: 1
    },
    {
      field: 'endDate',
      headerName: 'End Date',
      flex: 1
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => (
        <div>
          <Button
            variant="contained"
            color="primary"
            style={{ marginRight: 10 }}
            onClick={() => handleEdit(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDelete(params.row)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  return (
    <>
      <AddTask open={openAdd} handleClose={handleCloseAdd} />
      <Container>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h4">Request New Book</Typography>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              Request for Book 
            </Button>
          </Stack>
        </Stack>
        <TableStyle>
          <Box width="100%">
            <Card style={{ height: '600px', paddingTop: '15px' }}>
              <DataGrid
                rows={policyData}
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

export default Task;
