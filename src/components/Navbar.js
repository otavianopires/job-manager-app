import { Link } from "react-router-dom"
import styles from "./Navbar.module.css"

const Navbar = () => {
  const menu = [
    {
      path: "/admin",
      label: "Admin"
    },
    {
      path: "/jobs",
      label: "Jobs"
    },
    {
      path: "/clients",
      label: "Clients"
    },
  ]

  return (
    <nav className={styles.navbar}>
      <ul className={styles.menu}>
        {menu && menu.map((item, index) => (
          <li key={index}>
            <Link to={item.path} className={styles.menuLink}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navbar;