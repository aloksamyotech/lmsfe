import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, MenuItem, TextField, Typography } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

import chartData from './chart-data/total-growth-bar-chart';

const status = [
  {
    value: 'today',
    label: 'Today'
  },
  {
    value: 'month',
    label: 'This Month'
  },
  {
    value: 'year',
    label: 'This Year'
  }
];

const TotalGrowthBarChart = ({ isLoading }) => {
  const [value, setValue] = useState('today');
  const [bookCount, setBookCount] = useState(0);
  const [bookMonthVise, setBookMonthVise] = useState([]);

  const theme = useTheme();
  const customization = useSelector((state) => state.customization);

  const { navType } = customization;
  const { primary } = theme.palette.text;
  const darkLight = theme.palette.dark.light;
  const grey200 = theme.palette.grey[200];
  const grey500 = theme.palette.grey[500];

  const primary200 = theme.palette.primary[200];
  const primaryDark = theme.palette.primary.dark;
  const secondaryMain = theme.palette.secondary.main;
  const secondaryLight = theme.palette.secondary.light;

  useEffect(() => {
    const fetchBookAllotmentCount = async () => {
      try {
        const response = await axios.get('http://64.227.130.216:4300/user/getBookAllotedCount');
        // console.log('response', response);
        setBookCount(response.data.count);
        // setBookCount(response.data.count);
      } catch (error) {
        console.error('Error fetching book count:', error);
      }
    };

    fetchBookAllotmentCount();

    const fetchBookMonthVise = async () => {
      try {
        const response = await axios.get('http://64.227.130.216:4300/user/getBookMonthVise');
        console.log('response Data', response.data);

        var countArray = response.data.map((item) => item.count);
        setBookMonthVise(countArray);
        // setBookMonthVise(response.data.count);
        // setBookMonthVise(response.data.count);
      } catch (error) {
        console.error('Error fetching book count:', error);
      }
    };
    fetchBookMonthVise();
  }, []);

  useEffect(() => {
    const newChartData = {
      series: [{ name: 'Book', data: bookMonthVise }],
      ...chartData.options,
      colors: [primary200, primaryDark, secondaryMain, secondaryLight],
      axis: {
        labels: {
          style: {
            colors: [primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary]
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: [primary]
          }
        }
      },
      grid: {
        borderColor: grey200
      },
      tooltip: {
        theme: 'light'
      },
      legend: {
        labels: {
          colors: grey500
        }
      }
    };

    // do not load chart when loading
    if (!isLoading) {
      ApexCharts.exec(`bar-chart`, 'updateOptions', newChartData);
    }
  }, [navType, primary200, primaryDark, secondaryMain, secondaryLight, primary, darkLight, grey200, isLoading, grey500, bookMonthVise]);

  return (
    <>
      {isLoading ? (
        <SkeletonTotalGrowthBarChart />
      ) : (
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Grid container direction="column" spacing={1}>
                    <Grid item>
                      <Typography variant="subtitle2">Total Books Alloted </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="h3">{bookCount}</Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <TextField id="standard-select-currency" select value={value} onChange={(e) => setValue(e.target.value)}>
                    {status.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Chart {...chartData} />
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

// import PropTypes from 'prop-types';
// import { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import axios from 'axios';

// // material-ui
// import { useTheme } from '@mui/material/styles';
// import { Grid, MenuItem, TextField, Typography } from '@mui/material';

// // third-party
// import ApexCharts from 'apexcharts';
// import Chart from 'react-apexcharts';

// // project imports
// import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
// import MainCard from 'ui-component/cards/MainCard';
// import { gridSpacing } from 'store/constant';

// // chart data
// const status = [
//   {
//     value: 'today',
//     label: 'Today'
//   },
//   {
//     value: 'month',
//     label: 'This Month'
//   },
//   {
//     value: 'year',
//     label: 'This Year'
//   }
// ];

// const TotalGrowthBarChart = ({ isLoading }) => {
//   const [value, setValue] = useState('today');
//   const [bookCount, setBookCount] = useState(0);
//   const [seriesData, setSeriesData] = useState([]);
//   const theme = useTheme();
//   const customization = useSelector((state) => state.customization);

//   const { navType } = customization;
//   const { primary } = theme.palette.text;
//   const darkLight = theme.palette.dark.light;
//   const grey200 = theme.palette.grey[200];
//   const grey500 = theme.palette.grey[500];

//   const primary200 = theme.palette.primary[200];
//   const primaryDark = theme.palette.primary.dark;
//   const secondaryMain = theme.palette.secondary.main;
//   const secondaryLight = theme.palette.secondary.light;

//   const fetchBookMonthWiseData = async () => {
//     try {
//       const response = await axios.get('http://64.227.130.216:4300/user/getBookMonthVise');
//       const formattedData = response.data.map((item) => item.count);
//       setSeriesData(formattedData);
//     } catch (error) {
//       console.error('Error fetching month-wise book data:', error);
//     }
//   };

//   useEffect(() => {
//     fetchBookMonthWiseData();
//   }, []);

//   useEffect(() => {
//     const fetchBookAllotmentCount = async () => {
//       try {
//         const response = await axios.get('http://64.227.130.216:4300/user/getBookAllotedCount');
//         setBookCount(response.data.count);
//       } catch (error) {
//         console.error('Error fetching book count:', error);
//       }
//     };

//     fetchBookAllotmentCount();
//   }, []);

//   useEffect(() => {
//     const newChartData = {
//       ...chartData.options,
//       colors: [primary200, primaryDark, secondaryMain, secondaryLight],
//       xaxis: {
//         labels: {
//           style: {
//             colors: Array(12).fill(primary)
//           }
//         }
//       },
//       yaxis: {
//         labels: {
//           style: {
//             colors: [primary]
//           }
//         }
//       },
//       grid: {
//         borderColor: grey200
//       },
//       tooltip: {
//         theme: 'light'
//       },
//       legend: {
//         labels: {
//           colors: grey500
//         }
//       }
//     };

//     if (!isLoading) {
//       ApexCharts.exec(`bar-chart`, 'updateOptions', newChartData);
//     }
//   }, [navType, primary200, primaryDark, secondaryMain, secondaryLight, primary, darkLight, grey200, isLoading, grey500]);

//   const chartData = {
//     height: 480,
//     type: 'bar',
//     options: {
//       chart: {
//         id: 'bar-chart',
//         stacked: true,
//         toolbar: {
//           show: true
//         },
//         zoom: {
//           enabled: true
//         }
//       },
//       responsive: [
//         {
//           breakpoint: 480,
//           options: {
//             legend: {
//               position: 'bottom',
//               offsetX: -10,
//               offsetY: 0
//             }
//           }
//         }
//       ],
//       plotOptions: {
//         bar: {
//           horizontal: false,
//           columnWidth: '50%'
//         }
//       },
//       xaxis: {
//         type: 'category',
//         categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
//       },
//       legend: {
//         show: true,
//         fontSize: '14px',
//         fontFamily: `'Roboto', sans-serif`,
//         position: 'bottom',
//         offsetX: 20,
//         labels: {
//           useSeriesColors: false
//         },
//         markers: {
//           width: 16,
//           height: 16,
//           radius: 5
//         },
//         itemMargin: {
//           horizontal: 15,
//           vertical: 8
//         }
//       },
//       fill: {
//         type: 'solid'
//       },
//       dataLabels: {
//         enabled: false
//       },
//       grid: {
//         show: true
//       }
//     },
//     series: [
//       {
//         name: 'Books Allotted',
//         data: seriesData
//       }
//     ]
//   };

//   return (
//     <>
//       {isLoading ? (
//         <SkeletonTotalGrowthBarChart />
//       ) : (
//         <MainCard>
//           <Grid container spacing={gridSpacing}>
//             <Grid item xs={12}>
//               <Grid container alignItems="center" justifyContent="space-between">
//                 <Grid item>
//                   <Grid container direction="column" spacing={1}>
//                     <Grid item>
//                       <Typography variant="subtitle2">Total Book Allotted</Typography>
//                     </Grid>
//                     <Grid item>
//                       <Typography variant="h3">{bookCount}</Typography>
//                     </Grid>
//                   </Grid>
//                 </Grid>
//                 <Grid item>
//                   <TextField id="standard-select-currency" select value={value} onChange={(e) => setValue(e.target.value)}>
//                     {status.map((option) => (
//                       <MenuItem key={option.value} value={option.value}>
//                         {option.label}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </Grid>
//               </Grid>
//             </Grid>
//             <Grid item xs={12}>
//               <Chart {...chartData} />
//             </Grid>
//           </Grid>
//         </MainCard>
//       )}
//     </>
//   );
// };

// TotalGrowthBarChart.propTypes = {
//   isLoading: PropTypes.bool
// };

// export default TotalGrowthBarChart;
