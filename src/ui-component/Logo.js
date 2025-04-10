import { useTheme } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { url } from 'core/url';
import { Box } from '@mui/system';

const Logo = () => {
  const theme = useTheme();
  const [logoData, setLogoData] = useState(null);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axios.get(url.admin.logo)

        const image = response?.data.students[0]?.logo;

        const fullImageUrl = `${url.baseurl.baseurl}${image}`;

        setLogoData(fullImageUrl);
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };
    fetchLogo();
  }, []);

  return <Box component="img" src={logoData} sx={{ height: 70, marginLeft: 5, width: 150 }} />;
};

export default Logo;
