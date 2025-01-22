import { createApi, deleteData, getAll, editData } from './apiFuntiuon.js';

export const createAdmin = async (com_url, payload) => {
  const response = await createApi(com_url, payload);
  return response;
};

export const editAdmin = async (com_url, payload) => {
  const response = await editData(com_url, payload);
  return response;
};

export const uploadLogoAdmin = async (com_url, payload) => {
  const response = await editData(com_url, payload);
  return response;
};

export const loginAdmin = async (com_url, payload) => {
  const response = await createApi(com_url, payload);
  return response;
};

export const createSubscription = async (com_url, payload) => {
  const response = await createApi(com_url, payload);
  return response;
};

export const findSubscription = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const findHistoryBookAllotmentUser = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const updateSubscription = async (com_url, payload) => {
  const response = await editData(com_url, payload);
  return response;
};

export const deleteSubscription = async (com_url) => {
  const response = await deleteData(com_url);
  return response;
};

export const addBook = async (com_url, payload) => {
  const response = await createApi(com_url, payload);
  return response;
};

export const addManyBooks = async (com_url, payload) => {
  const response = await createApi(com_url, payload);
  return response;
};

export const deleteBook = async (com_url) => {
  const response = await deleteData(com_url);
  return response;
};

export const editBook = async (com_url, payload) => {
  const response = await editData(com_url, payload);
  return response;
};

export const viewBook = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const getBookManagement = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const getBookCount = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const addVender = async (com_url, payload) => {
  const response = await createApi(com_url, payload);
  return response;
};

export const viewVender = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const deleteVender = async (com_url) => {
  const response = await deleteData(com_url);
  return response;
};

export const editVender = async (com_url, payload) => {
  const response = await editData(com_url, payload);
  return response;
};

export const getVenderCount = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const addContact = async (com_url, payload) => {
  const response = await createApi(com_url, payload);
  return response;
};

export const getContactManagement = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const editContact = async (com_url, payload) => {
  const response = await editData(com_url, payload);
  return response;
};

export const deleteContact = async (com_url) => {
  const response = await deleteData(com_url);
  return response;
};

export const addPublications = async (com_url, payload) => {
  const response = await createApi(com_url, payload);
  return response;
};

export const getPublications = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const editPublications = async (com_url, payload) => {
  const response = await editData(com_url, payload);
  return response;
};

export const deletePublications = async (com_url) => {
  const response = await deleteData(com_url);
  return response;
};

export const getPublicationsCount = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const addRegister = async (com_url, payload) => {
  const response = await createApi(com_url, payload);
  return response;
};

export const registerMany = async (com_url, payload) => {
  const response = await createApi(com_url, payload);
  return response;
};

export const getRegisterManagement = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const editRegister = async (com_url, payload) => {
  const response = await editData(com_url, payload);
  return response;
};

export const deleteRegister = async (com_url) => {
  const response = await deleteData(com_url);
  return response;
};

export const getRegisterStudentCount = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const markFavorite = async (com_url, payload) => {
  const response = await createApi(com_url, payload);
  return response;
};

export const getMarkFavorite = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};
export const deleteMarkFavorite  = async (com_url) => {
  const response = await deleteData(com_url);
  return response;
};

export const markSubscription = async (com_url, payload) => {
  const response = await createApi(com_url, payload);
  return response;
};

export const getSubscription = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const findHistoryBookAllotment = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const bookAllotment = async (com_url, payload) => {
  const response = await createApi(com_url, payload);
  return response;
};

export const manyBookAllotment = async (com_url, payload) => {
  const response = await createApi(com_url, payload);
  return response;
};

export const allotmentManagement = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const getReceiveBook = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const removeReceiveBook = async (com_url) => {
  const response = await deleteData(com_url);
  return response;
};

export const submitBook = async (com_url, payload) => {
  const response = await createApi(com_url, payload);
  return response;
};

export const getSubmitBook = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const getSubmitBookDetails = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const getAllSubmitBookDetails = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const getInvoice = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const receiveBook = async (com_url, payload) => {
  const response = await createApi(com_url, payload);
  return response;
};

export const postReceiveBook = async (com_url, payload) => {
  const response = await createApi(com_url, payload);
  return response;
};

export const newReceiveBook = async (com_url, payload) => {
  const response = await createApi(com_url, payload);
  return response;
};

export const reBookAllotment = async (com_url, payload) => {
  const response = await createApi(com_url, payload);
  return response;
};

export const editBookAllotment = async (com_url, payload) => {
  const response = await editData(com_url, payload);
  return response;
};

export const getBookAllotmentById = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const viewBookAllotment = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const deleteAllotmentBook = async (com_url) => {
  const response = await deleteData(com_url);
  return response;
};

export const bookAllotmentCount = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const getBookMonthVise = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const getBookAllotedCount = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const bookAllotmentReport = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const addFineBook = async (com_url, payload) => {
  const response = await createApi(com_url, payload);
  return response;
};

export const getFineBook = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const getAllFineBooks = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const findByStudentId = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const findFine = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const purchaseBook = async (com_url, payload) => {
  const response = await createApi(com_url, payload);
  return response;
};

export const deletePurchaseBook = async (com_url) => {
  const response = await deleteData(com_url);
  return response;
};

export const updatePurchaseBook = async (com_url, payload) => {
  const response = await editData(com_url, payload);
  return response;
};

export const getPurchaseInvoice = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const getPurchaseBook = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};
export const bookAllotmentHistory  = async (com_url, payload) => {
  const response = await createApi(com_url, payload);
  return response;
};

export const editPurchaseBook = async (com_url, payload) => {
  const response = await editData(com_url, payload);
  return response;
};

export const getBookAllotmentHistory = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const getBookAllotmentHistoryDetails = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};

export const getBookAllotmentInvoice = async (com_url) => {
  const response = await getAll(com_url);
  return response;
};
