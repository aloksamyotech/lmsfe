import { useState } from 'react';
import { Stack, Button, Container, Typography, Card, Box } from '@mui/material';
import TableStyle from '../../ui-component/TableStyle';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import AddMeetings from './addPublications';
import axios from 'axios';
import Iconify from '../../ui-component/iconify';
import { useEffect, use } from 'react';

import { Dialog, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
// ----------------------------------------------------------------------

const meetingData = [
  {
    id: 1,
    name: 'Rohit',
    title: 'Ram Charan',
    author: 'vijai',
    address: 'indore',
    startDate: '08/01/2024',
    action: 'Edit'
    // subject: 'Task Testing',
    // status: 'In progress',
    // endDate: '09/01/2024',
    // duration: '30 min',
    // relatedTo: 'petter max',
    // assignedUser: 'active user',
  }
];

const Publications = () => {
  const [openAdd, setOpenAdd] = useState(false);
  const [data, setData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      cellClassName: 'name-column--cell name-column--cell--capitalize'
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 1
    },
    {
      field: 'author',
      headerName: 'Author',
      flex: 1
    },

    {
      field: 'startDate',
      headerName: ' Start Date',
      flex: 1
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1
    },
    // {
    //   field: 'endDate',
    //   headerName: 'End Date',
    //   flex: 1
    // },
    // {
    //   field: 'duration',
    //   headerName: 'Duration',
    //   flex: 1
    // },
    // {
    //   field: 'status',
    //   headerName: 'Status',
    //   flex: 1,
    //   cellClassName: 'name-column--cell--capitalize'
    // },
    // {
    //   field: 'relatedTo',
    //   headerName: 'Related To',
    //   flex: 1
    // },
    // {
    //   field: 'assignedUser',
    //   headerName: 'Assigned User',
    //   flex: 1
    // },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => (
        <div>
          <Button color="primary" onClick={() => handleEdit(params.row)} style={{ margin: '-9px' }}>
            <EditIcon />
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
      console.log('useEffect-----------');

      const response = await axios.get('http://localhost:4300/user/getPublications');
      console.log('After API------------', response);
      console.log('Id -----', response?.data?.PublicationsManagement);
      const fetchedData = await response?.data?.PublicationsManagement.map((item) => {
        console.log(item);
        return {
          id: item._id,
          name: item.name,
          title: item.title,
          author: item.author,
          address: item.address,
          startDate: formatDate(item.startDate),
          action: item.action
        };
      });
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

  const handleEdit = (publications) => {
    setEditData(publications);
  };
  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(`http://localhost:4300/user/editPublications/${editData.id}`, editData);
      const updatedPublications = response.data;
      setData((prevData) => prevData.map((item) => (item.id === updatedPublications.id ? updatedPublications : item)));
      setEditData(null);
    } catch (error) {
      console.error('Error updating Publications:', error);
    }
  };

  const handleDelete = (id) => {
    setBookToDelete(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:4300/user/deletePublications/${bookToDelete}`);

      setData((prevData) => prevData.filter((item) => item._id !== bookToDelete));
    } catch (error) {
      console.error('Error deleting publication:', error);
    }
  };
  const cancelDelete = () => {
    setOpenDeleteDialog(false);
    setBookToDelete(null);
  };

  return (
    <>
      <AddMeetings open={openAdd} fetchData={fetchData} handleClose={handleCloseAdd} />
      <Container>
        <Stack direction="row" alignItems="center" mb={5} justifyContent={'space-between'}>
          <Typography variant="h4">Publications List</Typography>
          <Stack direction="row" alignItems="center" justifyContent={'flex-end'} spacing={2}>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenAdd}>
              New Publications
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
              <Typography variant="h6">Edit Publications</Typography>
              <TextField
                label="Name"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Title"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Author"
                value={editData.author}
                onChange={(e) => setEditData({ ...editData, author: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="date"
                value={editData.date}
                onChange={(e) => setEditData({ ...editData, date: e.target.value })}
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
        <Dialog open={openDeleteDialog} onClose={cancelDelete}>
          <Box p={3}>
            <Typography variant="h6">Are you sure you want to delete this Publications?</Typography>
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
      </Container>
    </>
  );
};

export default Publications;
