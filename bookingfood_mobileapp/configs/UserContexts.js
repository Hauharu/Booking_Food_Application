import { createContext, useContext, useState } from "react";

export const MyUserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const loginInfo = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
      <MyUserContext.Provider value={{ user, loginInfo, logout }}>
        {children}
      </MyUserContext.Provider>
  );
};

export const useUser = () => useContext(MyUserContext);

export const MyDispatchContext = createContext();