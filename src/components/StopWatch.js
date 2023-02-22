import { useParams } from "react-router-dom";
import { useJob } from "../contexts/JobContext";
import styles from "./StopWatch.module.css";
import Timer from "./Timer";
import Button from "./Button";

const StopWatch = (props) => {
  const { id } = useParams();
  const {
    isActive,
    isPaused,
    time,
    startJob,
    completeJob,
    pauseJob,
    resumeJob
  } = useJob();

  const handleStart = async (e) => {
    e.preventDefault();
    startJob(id);
  };

  const handlePause = async (e) => {
    e.preventDefault();
    pauseJob();
  };

  const handleResume = async (e) => {
    e.preventDefault();
    resumeJob();
  };

  const handleComplete = () => {
    completeJob();
  };

  return (
    <div className={`${styles.stopWatch} ${props.className}`}>
      <Timer time={time} />
      <div className={styles.controllers}>
        {!isActive && <Button onClick={handleStart} className={styles.button}>Start</Button>}
        {isActive && !isPaused && <Button onClick={handlePause} className={styles.button}>Pause</Button>}
        {isActive && isPaused  && <Button onClick={handleResume} className={styles.button}>Resume</Button>}
        {isActive && <Button onClick={handleComplete} className={styles.button}>Complete</Button>}
      </div>
    </div>
  );
}
export default StopWatch;