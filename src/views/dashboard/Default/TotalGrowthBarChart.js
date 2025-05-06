import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { useTheme } from '@mui/material/styles';
import { Grid, MenuItem, TextField, Typography } from '@mui/material';

import Chart from 'react-apexcharts';

import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { url } from 'core/url';
import { postApi} from 'core/apiClient';

const dataTypes = [
  { value: 'allotment', label: 'Book Allotment' },
  { value: 'purchase', label: 'Book Purchase' },
  { value: 'submission', label: 'Book Submission' }
];

const TotalGrowthBarChart = ({ isLoading }) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [dataType, setDataType] = useState('allotment');
  const [bookMonthVise, setBookMonthVise] = useState(Array(12).fill(0));

  const theme = useTheme();
  const customization = useSelector((state) => state.customization);

  const { navType } = customization;
  const { primary } = theme.palette.text;
  const grey200 = theme.palette.grey[200];
  const grey500 = theme.palette.grey[500];
  const primary200 = '#D1C4E9';
  const fetchMonthWiseData = async () => {
    try {
      let apiUrl = '';

      switch (dataType) {
        case 'allotment':
          apiUrl = url.allotmentManagement.monthviseData;
          break;
        case 'purchase':
          apiUrl = url.purchaseBook.purchaseMonthviseData;
          break;
        case 'submission':
          apiUrl = url.booksubmission.monthwiseSubmission;
          break;
        default:
          apiUrl = url.allotmentManagement.monthviseData;
          break;
      }

      const response = await postApi(apiUrl, { year });
      if (response.data.success) {
        setBookMonthVise(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching month-wise data:', error);
    }
  };

  useEffect(() => {
    fetchMonthWiseData();
  }, [year, dataType]);

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} sx={{width:'620px'}}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid container direction="column" spacing={1}>
                  <Grid item>
                    <Typography variant="subtitle2">Total {dataTypes.find((d) => d.value === dataType)?.label}</Typography>
                  </Grid>
                </Grid>

                <Grid item>
                  <TextField
                    select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    label="Select Year"
                    variant="outlined"
                    size="small"
                    sx={{ width: 120 }}
                  >
                    {[2022, 2023, 2024, 2025].map((optionYear) => (
                      <MenuItem key={optionYear} value={optionYear}>
                        {optionYear}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    select
                    value={dataType}
                    onChange={(e) => setDataType(e.target.value)}
                    label="Select Data Type"
                    variant="outlined"
                    size="small"
                    sx={{ width: 180, ml: 2 }}
                  >
                    {dataTypes.map((item) => (
                      <MenuItem key={item.value} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Chart
                options={{
                  chart: { id: 'bar-chart', type: 'bar' },
                  xaxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    labels: { style: { colors: new Array(12).fill(primary) } }
                  },
                  yaxis: {
                    labels: { style: { colors: [primary] } }
                  },
                  colors: [primary200],
                  grid: { borderColor: grey200 },
                  tooltip: { theme: 'light' },
                  legend: {
                    labels: { colors: grey500 }
                  }
                }}
                series={[{ name: 'Books Data', data: bookMonthVise }]}
                type="bar"
                height={480}
              />
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

TotalGrowthBarChart.propTypes = {
  isLoading: PropTypes.bool
};

export default TotalGrowthBarChart;
