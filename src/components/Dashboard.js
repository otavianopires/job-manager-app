import { Outlet } from "react-router-dom";
import { useJob } from "../contexts/JobContext";
import ActiveJob from "./ActiveJob";
import styles from "./Dashboard.module.css"
import Header from "./Header";
import Navbar from "./Navbar";

const Dashboard = () => {
  const { activeJob } = useJob();
  return (
      <div className={`${styles.page} ${activeJob !== null ? styles.activeJob : ''}`}>
        <Header />
        <div className={styles.container}>
          <Navbar />
          <main className={styles.main}>
            <Outlet />
          </main>
        </div>
        <ActiveJob />
      </div>
  )
}

export default Dashboard;