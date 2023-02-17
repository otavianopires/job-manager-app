import { useParams } from "react-router-dom";
import { useJob } from "../contexts/JobContext";
import styles from "./StopWatch.module.css";
import Timer from "./Timer";
import Button from "./Button";

const StopWatch = (props) => {
  const { id } = useParams();
  const {
    activeJob,
    isActive,
    isPaused,
    setIsPaused,
    time,
    setActiveJobStartTime,
    setActiveJobEndTime,
    setReferenceTime,
  } = useJob();

  const handleStart = async (e) => {
    e.preventDefault();
    setActiveJobStartTime(id);
  };

  const handlePause = async (e) => {
    e.preventDefault();
    setIsPaused(true);
  };

  const handleResume = async (e) => {
    e.preventDefault();
    const pauseTime = Date.now() - parseInt(activeJob.attributes.totalJobTime);
    setReferenceTime(pauseTime);
    setIsPaused(false);
  };

  const handleStop = () => {
    setActiveJobEndTime();
  };

  return (
    <div className={`${styles.stopWatch} ${props.className}`}>
      <Timer time={time} />
      <div className={styles.controllers}>
        {!isActive && <Button onClick={handleStart} className={styles.button}>Start</Button>}
        {isActive && !isPaused && <Button onClick={handlePause} className={styles.button}>Pause</Button>}
        {isActive && isPaused  && <Button onClick={handleResume} className={styles.button}>Resume</Button>}
        {isActive && <Button onClick={handleStop} className={styles.button}>Complete</Button>}
      </div>
    </div>
  );
}
export default StopWatch;