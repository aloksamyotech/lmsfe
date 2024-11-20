import React, { createContext, useState } from 'react';

const UserContext = createContext({
  userId: null,
  userDetails: null,
  presalesDetails: null,
  setUserDetails: () => {},
  setPresalesDetails: () => {},
});

export const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [presalesDetails, setPresalesDetails] = useState(null);

  const userId = userDetails ? userDetails.id : null; // Get userId from userDetails

  return (
    <UserContext.Provider value={{ userId, userDetails, presalesDetails, setUserDetails, setPresalesDetails }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext };
