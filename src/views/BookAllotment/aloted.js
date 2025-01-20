import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import axios from 'axios';

const ViewAllottedBooks = () => {
  const [allottedBooks, setAllottedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch allotted books from the API
  useEffect(() => {
    const fetchAllottedBooks = async () => {
      try {
        const response = await axios.get('http://localhost:4300/user/getBookAllotmentHistory');
        setAllottedBooks(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch allotted books. Please try again later.');
        setLoading(false);
      }
    };

    fetchAllottedBooks();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        View Allotted Books
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Student Name</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Mobile Number</strong>
              </TableCell>
              <TableCell>
                <strong>Book Title</strong>
              </TableCell>
              <TableCell>
                <strong>Issued Date</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allottedBooks.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.studentName}</TableCell>
                <TableCell>{book.email}</TableCell>
                <TableCell>{book.mobileNumber}</TableCell>
                <TableCell>{book.bookTitle}</TableCell>
                <TableCell>{new Date(book.issuedDate).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ViewAllottedBooks;
