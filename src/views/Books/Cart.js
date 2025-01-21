import React, { useState } from 'react';
import { Box, Typography, Button, CardMedia, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { IconTrash } from '@tabler/icons-react';
import CloseIcon from '@mui/icons-material/Close';
import CartSummary from './cartSummary';
import { toast } from 'react-toastify';

const Cart = ({ cartItems, onRemoveFromCart, onClearCart, onIncreaseQuantity, onDeacrmentQuantity, selectedStudent, students }) => {
  const [summary, setSummary] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const totalAmount = cartItems.reduce((total, item) => total + (item.amount || 0), 0);

  const handleSubmit = () => {
    if (!selectedStudent) {
      toast.error('Please select a student.');
      return;
    }

    const studentDetails = students.find((student) => student.id === selectedStudent);

    if (!studentDetails) {
      alert('Selected student details not found.');
      return;
    }
    console.log('student is is ======================>', studentDetails.id);

    const cartSummary = {
      studentName: studentDetails.name,
      studentEmail: studentDetails.email,
      studentId: studentDetails.id,
      cartItems,
      totalAmount
    };

    setSummary(cartSummary);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSummary(null);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '70vh',
        overflowY: 'hidden',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'white',
        width: '100%',
        padding: 2
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: '80px',
          padding: '10px'
        }}
      >
        {cartItems.length === 0 ? (
          <Typography variant="h6" textAlign="center" color="textSecondary">
            Your cart is empty.
          </Typography>
        ) : (
          cartItems.map((item) => (
            <Box
              key={item._id + item.submissionType}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: 2,
                width: '100%',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
              }}
            >
              <CardMedia
                component="img"
                image={`http://localhost:4300/${item.upload_Book}`}
                alt={item.title}
                sx={{
                  width: 80,
                  height: 80,
                  objectFit: 'cover',
                  borderRadius: '8px',
                  mr: 2
                }}
              />

              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" fontWeight="bold">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Submission: {item.submissionTypeName || 'N/A'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Quantity: {item.quantity || 0}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Amount: ₹{(item.amount || 0).toFixed(2)}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Button variant="outlined" color="secondary" onClick={() => onIncreaseQuantity(item._id, item.submissionType)}>
                  +
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => onDeacrmentQuantity(item._id, item.submissionType)}>
                  -
                </Button>

                <Button variant="outlined" color="error" onClick={() => onRemoveFromCart(item._id, item.submissionType)}>
                  <IconTrash stroke={2} size={20} />
                </Button>
              </Box>
            </Box>
          ))
        )}
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          padding: '10px 20px',
          backgroundColor: 'white',
          borderTop: '1px solid #ccc',
          boxShadow: '0 -2px 6px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
          Total Amount: ₹{totalAmount.toFixed(2)}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{
            width: '30%',
            fontSize: '16px',
            padding: '10px',
            fontWeight: 'bold',
            borderRadius: '8px'
          }}
        >
          Submit
        </Button>
      </Box>

      <Dialog open={isPopupOpen} onClose={handleClosePopup} maxWidth="sm" fullWidth>
        <DialogTitle>
          Cart Summary
          <IconButton aria-label="close" onClick={handleClosePopup} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>{summary && <CartSummary summaryData={summary} />}</DialogContent>
      </Dialog>
    </Box>
  );
};

export default Cart;
