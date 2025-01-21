import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  Box
} from '@mui/material';
import PropTypes from 'prop-types';

const BooksModal = ({ show, handleClose, books, studentName }) => {
  return (
    <Dialog open={show} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ backgroundColor: '#1976d2', color: '#fff', textAlign: 'center', padding: '16px' }}>
        {`Books for ${studentName}`}
      </DialogTitle>
      <DialogContent sx={{ backgroundColor: '#f5f5f5', padding: '16px' }}>
        {books && books.length > 0 ? (
          <List>
            {books.map((book, index) => (
              <ListItem
                key={index}
                sx={{ backgroundColor: index % 2 === 0 ? '#e3f2fd' : '#ffffff', borderRadius: '8px', marginBottom: '12px' }}
              >
                <ListItemText
                  primary={
                    <Typography variant="h6" color="primary">
                      <strong> Book Name</strong>
                      {book.bookName}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ paddingLeft: '16px', paddingBottom: '8px' }}>
                      <Typography variant="body1" sx={{ marginBottom: '4px' }}>
                        <strong>Quantity:</strong> {book.quantity}
                      </Typography>
                      <Typography variant="body1" sx={{ marginBottom: '4px' }}>
                        <strong>Amount:</strong> ₹{book.amount}
                      </Typography>

                      <Typography variant="body1" sx={{ marginBottom: '4px' }}>
                        <strong>Submission Date:</strong> {new Date(book.submissionDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center', color: 'gray' }}>
            No books allocated for this student.
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ padding: '16px', backgroundColor: '#f1f1f1' }}>
        <Button onClick={handleClose} variant="contained" color="primary" sx={{ width: '100%' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

BooksModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  books: PropTypes.array.isRequired,
  studentName: PropTypes.string.isRequired
};

export default BooksModal;
