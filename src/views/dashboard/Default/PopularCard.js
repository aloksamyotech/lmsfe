import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { postApi } from 'core/apiClient';
import { url } from 'core/url';
import { Padding } from '@mui/icons-material';

const SoldQuantityDisplay = () => {
  const [soldQuantities, setSoldQuantities] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMonthName = (monthIndex) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];
    return months[monthIndex];
  };

  const fetchSoldQuantities = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const year = today.getFullYear();
      const currentMonth = today.getMonth();

      const lastThreeMonths = [currentMonth, currentMonth === 0 ? 11 : currentMonth - 1, currentMonth <= 1 ? 10 : currentMonth - 2];

      const response = await postApi(url.allotmentManagement.monthviseData, { year });
      if (response.data.success) {
        const result = response.data.data;

        const formattedData = lastThreeMonths.map((month) => ({
          month: month,
          year: month >= currentMonth ? year - 1 : year,
          quantity: result[month] || 0
        }));

        setSoldQuantities(formattedData.reverse());
      }
    } catch (error) {
      console.error('Error fetching sold quantities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSoldQuantities();
  }, []);

  return (
    <Box>
      {loading ? (
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 3 }}>
          Loading...
        </Typography>
      ) : (
        <Grid container spacing={2} sx={{ }}>
          {soldQuantities.map((data, index) => {
            const colors = ['#2196F3', '#673ab7', '#4CAF50'];

            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  sx={{
                    display: 'flex',
                    borderRadius: 2,
                    backgroundColor: '#fff',
                    overflow: 'hidden',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    PaddingTop:'10px',
                  }}
                >
                  <Box
                    sx={{
                      width: '30%',
                      backgroundColor: colors[index % colors.length],
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 700
                    }}
                  >
                    <Typography variant="h4" sx={{ textAlign: 'center', color: '#ffff' }}>
                      {getMonthName(data.month)} {data.year}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: '70%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      p: 2
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        color: '#000'
                      }}
                    >
                      {data.quantity}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.9rem',
                        color: '#555'
                      }}
                    >
                      Books Alloted
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default SoldQuantityDisplay;
