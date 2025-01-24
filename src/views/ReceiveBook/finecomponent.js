import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const AddFine = ({ fineid, open, handleClose }) => {
  console.log('fine id is ==================>', fineid);

  const [fineData, setFineData] = useState({
    fineid: fineid || '',
    amount: '',
    reason: ''
  });

  const [errors, setErrors] = useState({
    amount: '',
    reason: ''
  });

  const handleChange = (field, value) => {
    setFineData((prevData) => ({
      ...prevData,
      [field]: value
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: ''
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!fineData.amount) {
      isValid = false;
      newErrors.amount = 'Amount is required';
    }

    if (!fineData.reason) {
      isValid = false;
      newErrors.reason = 'Reason is required';
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Submitting Fine:', fineData);
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Book Fine</DialogTitle>
      <DialogContent>
        <p>Fine ID: {fineData.fineid}</p>
        <TextField
          label="Amount"
          variant="outlined"
          fullWidth
          value={fineData.amount}
          onChange={(e) => handleChange('amount', e.target.value)}
          error={!!errors.amount}
          helperText={errors.amount}
          sx={{ marginBottom: 2 }}
          inputProps={{ maxLength: 3 }}
        />
        <TextField
          label="Reason"
          variant="outlined"
          fullWidth
          value={fineData.reason}
          onChange={(e) => handleChange('reason', e.target.value)}
          error={!!errors.reason}
          helperText={errors.reason}
          sx={{ marginBottom: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFine;
