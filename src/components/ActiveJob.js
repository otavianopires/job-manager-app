import { useJob } from "../contexts/JobContext";
import styles from "./ActiveJob.module.css";
import Button from "./Button";
import StopWatch from "./StopWatch";

const ActiveJob = () => {
  const { activeJob } = useJob();

  if (!activeJob) {
    return
  }

  return (
    <div className={styles.activeJobContainer}>
      {activeJob !== null && activeJob.hasOwnProperty('id') && <StopWatch /> }
      <Button to={`/jobs/${activeJob.id}`} className={styles.button}>View job</Button>
    </div>
  )
}

export default ActiveJob;