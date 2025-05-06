import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
// import EarningCard from '../EarningCard';
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';

import TotalOrderLineChartCard from './TotalOrderLineChartCard';
// import TotalIncomeDarkCard from './TotalIncomeDarkCard';
//import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';
import AppTrafficBySite from './TrafficBySiteCard';
import Iconify from '../../../ui-component/iconify';
import AppTasks from './AppTask';
import AppConversionRates from './AppConversionCard';
import AppCurrentVisits from './AppCurrentVisitCard';
import TotalOrderLineChartCardd from './TotalOrderLineChaetCardd';
// import EarningCardd from './EarningCardd';
import EarningCardd from './EarningCardd';
import BookIssued from './BookIssued';
import ListedCategories from './ListedCategories';
import App from 'views/Card';
import TrandingBook from 'views/Card/trandingBook';
import Book2 from 'views/Card/book2';
import NewBook from 'views/Card/trandingBook';
// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const theme = useTheme();
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={3} md={6} sm={6} xs={12}>
            <TotalOrderLineChartCard isLoading={isLoading} />
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={12}>
            <EarningCard isLoading={isLoading} />
          </Grid>
          <Grid item sm={6} xs={12} md={6} lg={3}>
            <TotalOrderLineChartCardd isLoading={isLoading} />
          </Grid>
          <Grid item sm={6} xs={12} md={6} lg={3}>
            <EarningCardd isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>
      {/* <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={12}>
            <TrandingBook isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>*/}
      {/* <Grid item xs={12}>
        <Grid item xs={12} md={12}>
          <App isLoading={isLoading} />
        </Grid>
      </Grid>  */}
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={12}>
            <PopularCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={6} lg={6}>
            <TotalGrowthBarChart />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
