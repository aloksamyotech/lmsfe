import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ButtonBase } from '@mui/material';
import config from 'config';
import { MENU_OPEN } from 'store/actions';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from 'core/url';
import { getApi } from 'core/apiClient';
// ==============================|| MAIN LOGO ||============================== //
const LogoSection = () => {
  const defaultId = useSelector((state) => state.customization.defaultId);
  const dispatch = useDispatch();
  const [logoImg, setLogoImg] = useState('/Screenshot.png');
  const logoData = async () => {
    try {
      const response = await getApi(url.admin.adminProfile);
      const logo = response.data.students[0]?.logo ? `${url.baseurl.baseurl}${response.data.students[0].logo}` : '';
      setLogoImg(logo);
      // if (logo && logo !== logoImg) {
      //   setLogoImg(logo);
      // }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };
  useEffect(() => {
    logoData();
  }, []);
  return (
    <ButtonBase
      sx={{ width: 100 }}
      disableRipple
      onClick={() => dispatch({ type: MENU_OPEN, id: defaultId })}
      component={Link}
      to={config.defaultPath}
    >
      <img alt="Logo" src={logoImg} style={{ height: '80px', width: '210px', marginLeft: '72px', marginTop: '5px' }} />
    </ButtonBase>
  );
};
export default LogoSection;
