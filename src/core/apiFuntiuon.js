import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';

export const createApi = async (com_url, payload) => {
  const response = await axios.post(com_url, payload);
  return response;
};

export const getAll = async (com_url) => {
  const response = await axios.get(com_url);
  return response;
};

export const deleteData = async (com_url) => {
  const response = await axios.delete(com_url);
  return response;
};

export const editData = async (com_url, payload) => {
  const response = await axios.put(com_url, payload);
  console.log(`response in main`, response);

  return response;
};

export const loginUser = async (com_url, payload) => {
  const response = await axios.post(com_url, payload);
  return response;
};
export const registerUser = async (com_url, payload) => {
  const response = await axios.post(com_url, payload);
  return response;
};

// export function tokenPayload() {
//   const token = localStorage.getItem('token');
//   if (token) {
//     try {
//       const decodedToken = jwtDecode(token);
//       return decodedToken;
//     } catch (error) {
//       console.error('Error decoding token:', error);
//       return false;
//     }
//   } else {
//     return false;
//   }
// }
