export const url = {
  base_url: 'http://localhost:4300/',

  //   url.baseUrl = http://localhost:4300
  //       url.BookManagement.put = user/editBook
  //       id = editData.id
  //       com_rul = url.baseUrl + url.BookManagement.put + id
  //       payload = data
  //     update(com_url , payload),

  admin: {
    admin: 'user/adminProfilePage/',
    edit: 'user/adminEditProfilePage/',
    logo: 'user/adminGetLogo/',
    login: 'user/login/'
  },
  subscription: {
    Subscription: 'user/subscriptionType/',
    findSub: 'user/getSubscriptionType/',
    delete: 'user/deleteSubscriptionType/',
    update: 'user/editSubscriptionType/'
  },
  bookManagenent: {
    addBook: 'user/addBook/',
    addManyBooks: 'user/addManyBooks/',
    delete: 'user/deleteBook/',
    editBook: 'user/editBook/',
    viewBook: 'user/viewBookUser/',
    bookManagement: 'user/bookManagement/',
    bookCount: 'user/getBookCount/'
  },
  vendorManagement: {
    addVender: 'user/addVenderBook/',
    viewVender: 'user/venderManagement/',
    delete: 'user/deleteVender/',
    editVender: 'user/editVender/',
    venderCount: 'user/getVenderCount/'
  },
  favoriteStudents: {
    addContact: 'user/addContact/',
    contactManagement: 'user/contactManagement/',
    edit: 'user/editContact/',
    delete: 'user/deleteContact/'
  },
  publications: {
    addPublications: 'user/addPublications/',
    getPublications: 'user/getPublications/',
    editPublications: 'user/editPublications/',
    delete: 'user/deletePublications/',
    getPublicationsCount: 'user/getPublicationsCount/'
  },
  studentRegister: {
    addRegister: 'user/addRegister/',
    registerMany: 'user/registerMany',
    getRegisterManagement: 'user/registerManagement/',
    editRegister: 'user/editRegister/',
    deleteRegister: 'user/deleteRegister/',
    getRegisterStudentCount: 'user/getRegisterStudentCount/',
    markFavorite: 'user/markFavorite/',
    getMarkFavorite: 'user/getMarkFavorite/',
    markSubscription: 'user/markSubscription/',
    getSubscription: 'user/getSubscription/'
  },
  allotmentManagement: {
    findHistory: 'user/findHistoryBookAllotmentUser/',
    bookAllotment: 'user/bookAllotment/',
    manyBookAllotment: 'user/manyBookAllotment',
    allotmentManagement: 'user/allotmentManagement/',
    getReceiveBook: 'user/getReceiveBook/',
    removeReceiveBook: 'user/removeReceiveBook/',
    submitBook: 'user/submitBook/',
    getSubmitBook: 'user/getSubmitBook/',
    getSubmitBookDetails: 'user/getSubmitBookDetails/',
    getAllSubmitBookDetails: 'user/getAllSubmitBookDetails/',
    getInvoice: 'user/getInvoice/',
    receiveBook: 'user/receiveBook/',
    postReceiveBook: 'user/postReceiveBook/',
    newReceiveBook: 'user/newReceiveBook/',
    reBookAllotment: 'user/reBookAllotment/',
    editBookAllotment: 'user/editBookAllotment/',
    getBookAllotmentById: 'user/getBookAllotmentById/',
    viewBookAllotment: 'user/viewBookAllotmentUser/',
    deleteAllotmentBook: 'user/deleteAllotmentBook/',
    bookAllotmentCount: 'user/bookAllotmentCount/',
    getBookMonthVise: 'user/getBookMonthVise/',
    getBookAllotedCount: 'user/getBookAllotedCount/',
    bookAllotmentReport: 'user/bookAllotmentReport/'
  }
};
