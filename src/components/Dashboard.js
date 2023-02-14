import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import ActiveJob from "./ActiveJob";
import styles from "./Dashboard.module.css"
import Header from "./Header";

const Dashboard = () => {
  const  { token } = useUser();

  if (!token) {
    return <Navigate to="/login" />
  }

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.container}>
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
      <ActiveJob />
    </div>
  )
}

export default Dashboard;