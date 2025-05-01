import axios from 'axios';
import { toast } from 'react-toastify';
const getAuthHeaders = (headers = {}, isFormData = false) => {
  const token = localStorage.getItem('loginToken');
  return {
    Authorization: `Bearer ${token}`,
    ...headers,
    ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' })
  };
};

const handleAuthError = (error) => {
  const status = error.response?.status;
  const errorCode = error.response?.data?.code;
  const errorMessage = error.response?.data?.message || 'Error fetching';

  if (status === 401 && errorCode === 'TOKEN_EXPIRED') {
    localStorage.removeItem('loginToken');
    window.location.href = '/login';
    return;
  }
  toast.error(errorMessage);
};

export const getApi = async (url, params = {}, headers = {}) => {
  try {
    const token = localStorage.getItem('loginToken');
    if (!token) {
      localStorage.removeItem('loginToken');
      window.location.href = '/login';
      return;
    }

    const defaultHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...headers
    };

    const response = await axios.get(url, {
      headers: defaultHeaders,
      params: params
    });

    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postApi = async (url, data, headers = {}) => {
  try {
    const isFormData = data instanceof FormData;
    const defaultHeaders = getAuthHeaders(headers, isFormData);

    const response = await axios.post(url, data, {
      headers: defaultHeaders
    });

    return response;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

export const updateApi = async (url, data, headers = {}) => {
  try {
    const isFormData = data instanceof FormData;
    const defaultHeaders = getAuthHeaders(headers, isFormData);

    const response = await axios.put(url, data, {
      headers: defaultHeaders
    });

    return response;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

export const updateApiPatch = async (url, data, headers = {}) => {
  try {
    const isFormData = data instanceof FormData;
    const defaultHeaders = getAuthHeaders(headers, isFormData);

    const response = await axios.patch(url, data, {
      headers: defaultHeaders
    });

    return response;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

export const deleteApi = async (url, headers = {}) => {
  try {
    const defaultHeaders = getAuthHeaders(headers);

    const response = await axios.delete(url, {
      headers: defaultHeaders
    });

    return response?.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};
