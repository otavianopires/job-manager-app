import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useJob } from "../contexts/JobContext";
import styles from "./ActiveJob.module.css";
import StopWatch from "./StopWatch";
const ActiveJob = () => {
  const { activeJob } = useJob();

  if (!activeJob) {
    return
  }

  return (
    <div className={styles.activeJobContainer}>
      <h3>Active Job</h3>
      {activeJob !== null && activeJob.hasOwnProperty('id') && <StopWatch /> }
      <h2><Link to={`/jobs/${activeJob.id}`}>{activeJob.attributes.title}</Link></h2>
    </div>
  )
}

export default ActiveJob;