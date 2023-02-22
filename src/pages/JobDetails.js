import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import StopWatch from "../components/StopWatch";
import Timer from "../components/Timer";
import { useJob } from "../contexts/JobContext";
import { useUser } from "../contexts/UserContext";
import { fetchData, formatDate, generateQueryString, getTotalTimeInMiliseconds } from "../lib/helpers";
import styles from "./JobDetails.module.css";

const JobDetails = () => {
  const { id } = useParams();
  const { activeJob, queryParams } = useJob();
  const { user } = useUser();
  const [job, setJob] = useState({});
  const [loading, setLoading] = useState(false);
  const [overdue, setOverdue] = useState(false);
  const [timeAvailable, setTimeAvailable] = useState(0);
  const [jobTime, setJobTime] = useState({});

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
      if ( response.data.attributes.startTime !== null ) {
        checkOverdue(response.data.attributes.startTime);
      }
      let totalTimeInMiliseconds = getTotalTimeInMiliseconds(response.data.attributes.startTime, response.data.attributes.endTime);
      setTimeAvailable(totalTimeInMiliseconds);
      const jobTimes = response.data.attributes.job_times.data;
      const result = jobTimes.filter(checkComplete);
      if (result.length > 0) {
        setJobTime(result[0]);
        setOverdue(false);
      }
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

  const checkComplete = (item) => {
    return item.attributes.users_permissions_user.data.id === user.id;
  }

  const showStopWatch = () => {
    if (activeJob !== null && activeJob.id === parseInt(id) || activeJob === null && !jobTime.hasOwnProperty('id')) {
      return (<StopWatch className={styles.stopWatch} /> )
    }
  }

  /**
   * Get job details from specific id.
   */
  useEffect(() => {
    setLoading(true);
    if (user) {
      getJob();
    }
    return () => {};
  }, [user]);

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
        {overdue && <div className={styles.overdue}>This is overdue</div>}

        {jobTime && jobTime.hasOwnProperty('id') && jobTime.attributes.active === false && jobTime.attributes.endTime !== null &&
        <div className={styles.complete}><span className={styles.checkContainer}><span className={styles.check}></span></span> Completed</div>
        }

        { showStopWatch() }
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
              {jobTime && jobTime.hasOwnProperty('id') && jobTime.attributes.active === false && jobTime.attributes.endTime !== null &&
              <tr>
                <th>Executed</th>
                <td>
                  {jobTime.attributes.startTime && <>{formatDate(jobTime.attributes.startTime, { weekday: "short", year: "numeric", month: "short", day: "numeric", timeZone: "EST" })}</>}
                </td>
                <td>
                  {jobTime.attributes.endTime && <>{formatDate(jobTime.attributes.endTime, { weekday: "short", year: "numeric", month: "short", day: "numeric", timeZone: "EST" })}</>}
                </td>
                <td>
                  {jobTime.attributes.totalJobTime && jobTime.attributes.endTime && <><Timer time={jobTime.attributes.totalJobTime} /></>}
                </td>
              </tr>}
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