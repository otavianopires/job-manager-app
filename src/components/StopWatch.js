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
      {!isActive && <Button onClick={handleStart} className={styles.button} leftIcon="play_circle">Start</Button>}
      <div className={styles.controllers}>
        {isActive && !isPaused && <Button onClick={handlePause} className={styles.button} leftIcon="pause_circle">Pause</Button>}
        {isActive && isPaused  && <Button onClick={handleResume} className={styles.button} leftIcon="play_circle">Resume</Button>}
        {isActive && <Button onClick={handleComplete} className={styles.button} leftIcon="check_box">Complete</Button>}
      </div>
    </div>
  );
}
export default StopWatch;