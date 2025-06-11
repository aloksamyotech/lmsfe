import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { getApi, postApi } from 'core/apiClient';
import { url } from 'core/url';
import { fetchCurrency } from 'core/comman';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import BookmarkAddRoundedIcon from '@mui/icons-material/BookmarkAddRounded';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const SummaryCards = () => {
  const [data, setData] = useState({
    totalAllotted: 0,
    submittedBooks: 0,
    pendingBooks: 0,
    totalEarning: 0
  });
  const [currencySymbol, setCurrencySymbol] = useState('');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getCurrency = async () => {
      const symbol = await fetchCurrency();
      setCurrencySymbol(symbol);
    };
    getCurrency();
  }, []);
  const fetchSummaryData = async () => {
    try {
      setLoading(true);

      const allotmentResponse = await getApi(url.allotmentManagement.getBookAllotedCount);
      const totalAllotted = allotmentResponse?.data?.totalQuantity || 0;
      const submisionRes = await getApi(url.booksubmission.getSubmittedBookCount);
      const submittedBooks = submisionRes?.data?.totalSubmitted;
      const pendingBooks = totalAllotted - submittedBooks;
      const earningRes = await getApi(url.allotmentManagement.getTotalEarnings);
      const totalEarning = earningRes?.data?.totalEarning;
      setData({
        totalAllotted,
        submittedBooks,
        pendingBooks,
        totalEarning
      });
    } catch (err) {
      console.error('Error fetching summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummaryData();
  }, []);

  const cardDetails = [
    {
      label: 'Total Allotted',
      value: data.totalAllotted,
      icon: <BookmarkRemoveIcon fontSize="large" />,
      color: '#673ab7'
    },
    {
      label: 'Submitted Books',
      value: data.submittedBooks,
      icon: <BookmarkAddRoundedIcon fontSize="large" />,
      color: '#2196f3'
    },
    {
      label: 'Pending Books',
      value: data.pendingBooks,
      icon: <PendingActionsIcon fontSize="large" />,
      color: '#4caf50'
    },
    {
      label: 'Total Earning',
      value: `${currencySymbol}${data.totalEarning}`,
      icon: <MonetizationOnIcon fontSize="large" />,
      color: '#f44336'
    }
  ];

  return (
    <Box>
      {loading ? (
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 3 }}>
          Loading...
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {cardDetails.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  overflow: 'hidden',
                  borderRadius: 2,
                  boxShadow: 3,
                  height: 60
                }}
              >
                <Box
                  sx={{
                    width: '30%',
                    backgroundColor: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: '#fff'
                  }}
                >
                  {card.icon}
                </Box>
                <Box sx={{ width: '70%', p: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {card.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: card.labelColor }}>
                    {card.label}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default SummaryCards;
