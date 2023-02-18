import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { JobProvider } from "../contexts/JobContext";
import { useUser } from "../contexts/UserContext";
import { fetchData } from "../lib/helpers";
import ActiveJob from "./ActiveJob";
import styles from "./Dashboard.module.css"
import Header from "./Header";
import Navbar from "./Navbar";

const Dashboard = () => {
  const  { token } = useUser();

  if (!token) {
    return <Navigate to="/login" />
  }

  return (
    <JobProvider>
      <div className={styles.page}>
        <Header />
        <div className={styles.container}>
          <Navbar />
          <main className={styles.main}>
            <Outlet />
          </main>
        </div>
        <ActiveJob />
      </div>
    </JobProvider>
  )
}

export default Dashboard;