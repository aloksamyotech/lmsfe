const base_url = 'http://localhost:4300/';
export const url = {
  //   url.baseUrl = http://localhost:4300
  //       url.BookManagement.put = user/editBook
  //       id = editData.id
  //       com_rul = url.baseUrl + url.BookManagement.put + id
  //       payload = data
  //     update(com_url , payload),

  admin: {
    adminProfile: base_url + 'user/adminProfilePage/',
    edit: base_url + 'user/adminEditProfilePage/',
    logo: base_url + 'user/adminGetLogo/',
    login: base_url + 'user/login/'
  },
  subscription: {
    Subscription: base_url + 'user/subscriptionType/',
    findSubscription: base_url + 'user/getSubscriptionType/',
    delete: base_url + 'user/deleteSubscriptionType/',
    update: base_url + 'user/editSubscriptionType/'
  },
  bookManagenent: {
    addBook: base_url + 'user/addBook/',
    addManyBooks: base_url + 'user/addManyBooks/',
    delete: base_url + 'user/deleteBook/',
    editBook: base_url + 'user/editBook/',
    viewBook: base_url + 'user/viewBookUser/',
    bookManagement: base_url + 'user/bookManagement/',
    bookCount: base_url + 'user/getBookCount/'
  },
  vendorManagement: {
    addVender: base_url + 'user/addVenderBook/',
    viewVender: base_url + 'user/venderManagement/',
    delete: base_url + 'user/deleteVender/',
    editVender: base_url + 'user/editVender/',
    venderCount: base_url + 'user/getVenderCount/'
  },
  favoriteStudents: {
    addContact: base_url + 'user/addContact/',
    contactManagement: base_url + 'user/contactManagement/',
    edit: base_url + 'user/editContact/',
    delete: base_url + 'user/deleteContact/'
  },
  publications: {
    addPublications: base_url + 'user/addPublications/',
    getPublications: base_url + 'user/getPublications/',
    editPublications: base_url + 'user/editPublications/',
    delete: base_url + 'user/deletePublications/',
    getPublicationsCount: base_url + 'user/getPublicationsCount/'
  },
  studentRegister: {
    addRegister: base_url + 'user/addRegister/',
    registerMany: base_url + 'user/registerMany',
    getRegisterManagement: base_url + 'user/registerManagement/',
    editRegister: base_url + 'user/editRegister/',
    deleteRegister: base_url + 'user/deleteRegister/',
    getRegisterStudentCount: base_url + 'user/getRegisterStudentCount/',
    markFavorite: base_url + 'user/markFavorite/',
    getMarkFavorite: base_url + 'user/getMarkFavorite/',
    markSubscription: base_url + 'user/markSubscription/',
    getSubscription: base_url + 'user/getSubscription/'
  },
  allotmentManagement: {
    findHistory: base_url + 'user/findHistoryBookAllotmentUser/',
    bookAllotment: base_url + 'user/bookAllotment/',
    manyBookAllotment: base_url + 'user/manyBookAllotment',
    allotmentManagementData: base_url + 'user/allotmentManagement/',
    getReceiveBook: base_url + 'user/getReceiveBook/',
    removeReceiveBook: base_url + 'user/removeReceiveBook/',
    submitBook: base_url + 'user/submitBook/',
    getSubmitBook: base_url + 'user/getSubmitBook/',
    getSubmitBookDetails: base_url + 'user/getSubmitBookDetails/',
    getAllSubmitBookDetails: base_url + 'user/getAllSubmitBookDetails/',
    getInvoice: base_url + 'user/getInvoice/',
    receiveBook: base_url + 'user/receiveBook/',
    postReceiveBook: base_url + 'user/postReceiveBook/',
    newReceiveBook: base_url + 'user/newReceiveBook/',
    reBookAllotment: base_url + 'user/reBookAllotment/',
    editBookAllotment: base_url + 'user/editBookAllotment/',
    getBookAllotmentById: base_url + 'user/getBookAllotmentById/',
    viewBookAllotment: base_url + 'user/viewBookAllotmentUser/',
    deleteAllotmentBook: base_url + 'user/deleteAllotmentBook/',
    bookAllotmentCount: base_url + 'user/bookAllotmentCount/',
    getBookMonthVise: base_url + 'user/getBookMonthVise/',
    getBookAllotedCount: base_url + 'user/getBookAllotedCount/',
    bookAllotmentReport: base_url + 'user/bookAllotmentReport/'
  },
  fine: {
    addFineBook: base_url + 'user/addFineBook/',
    getFineBook: base_url + 'user/getFineBook/',
    getAllFineBooks: base_url + 'user/getAllFineBooks/',
    findByStudentId: base_url + 'user/findByStudentId/', 
    findFine: base_url+'user/findFineInvoice/'
  },
  purchaseBook: {
    purchaseBook: base_url + 'user/purchaseBook/',
    deletePurchaseBook: base_url + 'user/deletePurchaseBook/',
    updatePurchaseBook: base_url + 'user/updatePurchaseBook/',
    purchaseManagement: base_url + 'user/purchaseManagement/',
    getPurchaseInvoice: base_url + 'user/getPurchaseInvoice/',
    edit: base_url + 'user/editPurchaseBook/'
  },
  bookAllotmentHistory: {
    bookAllotmentHistory: base_url + 'user/bookAllotmentHistory/',
    getBookAllotmentHistory: base_url + 'user/getBookAllotmentHistory/',
    getBookDetailHistoryStudentId: base_url + 'user/getBookDetailHistoryStudentId/',
    getBookAllotmentInvoice: base_url + 'user/getBookAllotmentInvoice/'
  }
};
