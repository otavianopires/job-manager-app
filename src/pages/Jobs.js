import { useEffect, useState } from 'react';
import { Link } from "react-router-dom"
import {fetchData, formatDate, generateQueryString} from '../lib/helpers';
import styles from "./Jobs.module.css";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const getJobs = async () => {
    var params = {
      'fields[0]': 'title',
      'fields[1]': 'startTime',
      'fields[2]': 'endTime',
      'populate[client][fields][0]': 'name',
    };

    const response = await fetchData(`${process.env.REACT_APP_API_URL}/jobs?${generateQueryString(params)}`);
    if (response.data !== null && response.data.length > 0) {
      setJobs(response.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    getJobs();
    return () => {};
  }, []);

  return (
    <div>
      <h2>Jobs</h2>

        {loading && <p >Loading...</p>}

        {!loading &&
        <div className={styles.jobList}>
          {jobs.map(job => (
            <div key={job.id} className={styles.jobItem}>
              <h3>{job.attributes.title}</h3>
              <ul className={styles.schedule}>
                <li>Start: {formatDate(job.attributes.startTime, { weekday: "short", year: "numeric", month: "short", day: "numeric", timeZone: "EST" })}</li>
                <li>End: {formatDate(job.attributes.endTime, { weekday: "short", year: "numeric", month: "short", day: "numeric", timeZone: "EST" })}</li>
              </ul>
              <Link to={`/jobs/${job.id}`} className={styles.button}>View details</Link>
            </div>
          ))}
        </div>
        }
    </div>
  )
}

export default Jobs;