import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import Button from "./Button";
import styles from "./Header.module.css";

const Header = () => {
  const { user, logout } = useUser();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
  }

  const handleProfileClick = (e) => {
    e.preventDefault();
    setShowProfile(!showProfile);
  }

  return (
    <header className={styles.header}>
      <span className={styles.logo}>Job Manager</span>
      <div className={styles.profileContainer}>
        <button className={styles.profileButton} onClick={handleProfileClick}><span className="material-symbols-outlined">person</span></button>
        {showProfile &&<div className={styles.profile}>
          <ul>
            <li><span className={styles.userEmail}>{user.email}</span></li>
            <li><a href="#" onClick={handleLogout}>Logout</a></li>
          </ul>
        </div>}
      </div>
    </header>
  )
}

export default Header;