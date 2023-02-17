import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import StopWatch from "../components/StopWatch";
import Timer from "../components/Timer";
import { useJob } from "../contexts/JobContext";
import { fetchData, formatDate, generateQueryString, getTotalTimeInMiliseconds } from "../lib/helpers";
import styles from "./JobDetails.module.css";

const JobDetails = () => {
  const { id } = useParams();
  const { activeJob, queryParams } = useJob();
  const [job, setJob] = useState({});
  const [loading, setLoading] = useState(false);
  const [overdue, setOverdue] = useState(false);
  const [timeAvailable, setTimeAvailable] = useState(0);

  /**
   * Get job details from specific id.
   */
  const getJob = async () => {
    if (typeof id === 'undefined') {
      return false;
    }

    const response = await await fetchData(`${process.env.REACT_APP_API_URL}/jobs/${id}?${generateQueryString(queryParams)}`);
    if (response.data !== null && response.data.hasOwnProperty('id')) {
      setJob(response.data);
      if ( response.data.attributes.activeStartTime === null ) {
        checkOverdue(response.data.attributes.startTime);
      }
      let totalTimeInMiliseconds = getTotalTimeInMiliseconds(response.data.attributes.startTime, response.data.attributes.endTime);
      setTimeAvailable(totalTimeInMiliseconds);
    } else {
      setJob(null);
    }
    setLoading(false);
  }

  const checkOverdue = (startTime) => {
    const today = new Date();
    const date = new Date(startTime);
    if (date <= today) {
      setOverdue(true);
    }
  }

  /**
   * Get job details from specific id.
   */
  useEffect(() => {
    setLoading(true);
    getJob();
    return () => {};
  }, []);

  /**
   * Set job with activeJob data if id matches URL parameter.
   */
  useEffect(() => {
    if (activeJob !== null && activeJob.id === parseInt(id)) {
      setJob(activeJob);
    } else {
      setLoading(true);
      getJob();
    }
    return () => {};
  }, [activeJob, id]);

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div className={styles.jobContainer}>
      {job !== null && job.hasOwnProperty('id') && <>
        <h1>Job: {job.attributes.title}</h1>
        {overdue && ( activeJob === null || activeJob.id !== job.id ) && <div className={styles.overdue}>This is overdue</div>}

        {job.attributes.totalJobTime && job.attributes.activeEndTime &&
        <div className={styles.complete}><span class={styles.checkContainer}><span class={styles.check}></span></span> Completed</div>
        }

        {job.id && job.attributes.activeEndTime === null && ( activeJob === null || activeJob.id === job.id ) && <StopWatch className={styles.stopWatch} /> }
        <div className={styles.schedule}>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Start</th>
                <th>End</th>
                <th>Time available</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Scheduled</th>
                <td>
                  {formatDate(job.attributes.startTime, { weekday: "short", year: "numeric", month: "short", day: "numeric", timeZone: "EST" })}
                </td>
                <td>
                  {formatDate(job.attributes.endTime, { weekday: "short", year: "numeric", month: "short", day: "numeric", timeZone: "EST" })}
                </td>
                <td>
                  <Timer time={timeAvailable} />
                </td>
              </tr>
              <tr>
                <th>Executed</th>
                <td>
                  {job.attributes.activeStartTime && <>{formatDate(job.attributes.activeStartTime, { weekday: "short", year: "numeric", month: "short", day: "numeric", timeZone: "EST" })}</>}
                </td>
                <td>
                  {job.attributes.activeEndTime && <>{formatDate(job.attributes.activeEndTime, { weekday: "short", year: "numeric", month: "short", day: "numeric", timeZone: "EST" })}</>}
                </td>
                <td>
                  {job.attributes.totalJobTime && job.attributes.activeEndTime && <><Timer time={job.attributes.totalJobTime} /></>}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          {job.attributes.description}
        </div>

        <h3>About the client</h3>

        <ul>
          <li>{job.attributes.client.data.attributes.name}</li>
          <li>{job.attributes.client.data.attributes.address}</li>
        </ul>
      </>}
      {job === null && <p>Job not available</p>}
    </div>
  )
}

export default JobDetails;