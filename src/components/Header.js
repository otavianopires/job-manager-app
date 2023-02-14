import { useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { fetchData } from "../lib/helpers";
import Button from "./Button";
import styles from "./Header.module.css";

const Header = () => {
  const { user, setUser, setToken } = useUser();
  const handleLogout = (e) => {
    e.preventDefault();
    setUser({});
    setToken(null);
  }

  useEffect(() => {
    fetchData(`${process.env.REACT_APP_API_URL}/users/me`)
      .then((user) => {
        if (!user.hasOwnProperty('error')) {
          setUser(user);
        }
      });
  }, []);

  return (
    <header className={styles.header}>
      <span className={styles.logo}>Job Manager</span>
      <div className={styles.user}>
        <span className={styles.userEmail}>{user.email}</span>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
    </header>
  )
}

export default Header;