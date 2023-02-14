import { createContext, useContext, useState } from "react";

const UserContext = createContext({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
});

// ContextProvider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, _setToken] = useState(localStorage.getItem('jm-access-token'));

  const setToken = (token) => {
    _setToken(token);
    if (token) {
      localStorage.setItem('jm-access-token', token);
    } else {
      localStorage.removeItem('jm-access-token');
    }
  }

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      token,
      setToken
    }}>
      {children}
    </UserContext.Provider>
  )
}

// useStateContext
export const useUser = () => useContext(UserContext);