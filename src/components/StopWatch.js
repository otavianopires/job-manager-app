import { useParams } from "react-router-dom";
import { useJob } from "../contexts/JobContext";
import Timer from "./Timer";

const StopWatch = () => {
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
    <div className="stop-watch">
      <Timer time={time} />
      <div className="buttons">
        {!isActive && <button onClick={handleStart}>Start</button>}
        {isActive && !isPaused && <button onClick={handlePause}>Pause</button>}
        {isActive && isPaused  && <button onClick={handleResume}>Resume</button>}
        {isActive && <button onClick={handleStop}>Complete</button>}
      </div>
    </div>
  );
}
export default StopWatch;