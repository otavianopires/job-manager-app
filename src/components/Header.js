import { useUser } from "../contexts/UserContext";
import Button from "./Button";
import styles from "./Header.module.css";

const Header = () => {
  const { user, logout } = useUser();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  }

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