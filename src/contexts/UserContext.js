import { createContext, useContext, useEffect, useState } from "react";
import { fetchData } from "../lib/helpers";

const UserContext = createContext({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
  login: () => {},
  logout: () => {}
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, _setToken] = useState(localStorage.getItem('jm-access-token'));

  /**
   * Perform login to Rest API endpoint.
   * @param {object} loginData User identifier and password
   * @returns {object} The response with possible user data or login errors
   */
  const login = async (loginData) => {
    const response = await fetchData(`${process.env.REACT_APP_API_URL}/auth/local`, loginData, 'POST');
    return response;
  }

  /**
   *  Store toke in local storage.
   * @param {string} token Token value in string format.
   */
  const setToken = (token) => {
    _setToken(token);
    if (token) {
      localStorage.setItem('jm-access-token', token);
    } else {
      localStorage.removeItem('jm-access-token');
    }
  }

  /**
   * Get currect user data and set global user.
   */
  const getCurrentUser = async () => {
    const user = await fetchData(`${process.env.REACT_APP_API_URL}/users/me`);
    if (user !== null && user.hasOwnProperty('id')) {
      setUser(user);
    }
  }

  /**
   * Logout user by removing user data and token.
   */
  const logout = () => {
    setUser({});
    setToken(null);
  }

  /**
   * Get currect user data when page refreshes and token exists.
   */
  useEffect(() => {
    if (token) {
      getCurrentUser();
    }
    return () => {};
  }, []);

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      token,
      setToken,
      login,
      logout
    }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext);
