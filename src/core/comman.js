export const fetchCurrency = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user.currencySymbol) {
    return user.currencySymbol;
  }
};
