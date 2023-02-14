import { useEffect, useState } from 'react';
import { Link } from "react-router-dom"
import {fetchData, generateQueryString} from '../lib/helpers';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const getJobs = () => {
    var params = {
      'fields[0]': 'title',
      'fields[1]': 'startTime',
      'fields[2]': 'endTime',
      'populate[client][fields][0]': 'name',
    };

    fetchData(`${process.env.REACT_APP_API_URL}/jobs?${generateQueryString(params)}`)
      .then((jobs) => {
        setLoading(false);
        setJobs(jobs.data);
      })
  }

  useEffect(() => {
    setLoading(true);
    getJobs();

    return () => {
      setLoading(false);
    }
  }, []);

  return (
    <div>
      <h2>Jobs</h2>
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>Title</th>
            <th>Start Date/Time</th>
            <th>End Date/Time</th>
            <th>Client</th>
            <th>Actions</th>
          </tr>
        </thead>
        {loading &&
        <tbody>
          <tr>
            <td colSpan="4">Loading...</td>
          </tr>
        </tbody>
        }
        {!loading && <tbody>
          {jobs.map(job => (
            <tr key={job.id}>
              <td>{job.id}</td>
              <td>{job.attributes.title}</td>
              <td>{job.attributes.startTime}</td>
              <td>{job.attributes.endTime}</td>
              <td>{job.attributes.client.data.attributes.name}</td>
              <td><Link to={`/jobs/${job.id}`}>View details</Link></td>
            </tr>
          ))}
        </tbody>
        }
      </table>
    </div>
  )
}

export default Jobs;