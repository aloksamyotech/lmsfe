import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoutes() {
  let userValidation = localStorage.getItem('loginToken') == null ? false : true;
  return <>{userValidation ? <Outlet /> : <Navigate to="/login" />};</>;
}
