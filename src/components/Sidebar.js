import { Link } from "react-router-dom"
import styles from "./Sidebar.module.css"

const Sidebar = () => {
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
      path: "/users",
      label: "Users"
    },
  ]

  return (
    <aside className={styles.aside}>
      <ul className={styles.menu}>
        {menu && menu.map((item, index) => (
          <li key={index}>
            <Link to={item.path} className={styles.menuLink}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default Sidebar;