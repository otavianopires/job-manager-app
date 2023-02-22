import { Link, useLocation } from "react-router-dom"
import styles from "./Navbar.module.css"

const Navbar = () => {
	const location = useLocation();
  const menu = [
    {
      path: "/admin",
      label: "Admin",
      icon: "home"
    },
    {
      path: "/jobs",
      label: "Jobs",
      icon: "view_agenda"
    },
    {
      path: "/clients",
      label: "Clients",
      icon: "groups"
    },
  ]

  return (
    <nav className={styles.navbar}>
      <ul className={styles.menu}>
        {menu && menu.map((item, index) => (
          <li key={index}>
            <Link to={item.path} className={`${styles.menuLink}${location.pathname.includes(item.path) ? ` ${styles.active}` : ''}`}><span className={`material-symbols-outlined ${styles.icon}`}>{item.icon}</span><span className={styles.label}>{item.label}</span></Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navbar;