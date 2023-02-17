import { Navigate, Outlet } from "react-router-dom"
import { useUser } from "../contexts/UserContext";
import styles from "./PublicLayout.module.css";

const PublicLayout = () => {
  const { token } = useUser();
  if (token) {
    return <Navigate to="/jobs" />
  }
  return (
    <div className={styles.page}>
      <h1>Job Manager</h1>
      <div className={styles.container}>
        <Outlet />
      </div>
    </div>
  )
}

export default PublicLayout;