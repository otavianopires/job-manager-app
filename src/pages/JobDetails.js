import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CountdownTimer from "../components/CountdownTimer";
import { useJob } from "../contexts/JobContext";
import { fetchData, generateQueryString } from "../lib/helpers";

const JobDetails = () => {
  const { id } = useParams();
  const { currentJob, setCurrentJob } = useJob();
  const [job, setJob] = useState({});
  const [loading, setLoading] = useState(false);

  const getJob = () => {
    var params = {
      'fields[0]': 'title',
      'fields[1]': 'startTime',
      'fields[2]': 'endTime',
      'fields[3]': 'description',
      'populate[client][fields][0]': 'name',
      'populate[client][fields][1]': 'address',
      'populate[client][fields][3]': 'description',
    };
    fetchData(`${process.env.REACT_APP_API_URL}/jobs/${id}?${generateQueryString(params)}`)
      .then((job) => {
        setLoading(false);
        setJob(job.data);
      })
      .catch(() => {
        setLoading(false);
      });
  }

  const formatDate = (value, locale = 'en-CA') => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "EST",
      timeZoneName: "short"
    };
    const date = new Date(value);
    // console.log(new Intl.DateTimeFormat('en-CA', { dateStyle: 'medium', timeStyle: 'long', timeZone: 'EST' }).format(date));
    return `${date.toLocaleTimeString(locale, options)}`;
  }


  const setActiveStartTime = () => {
    const activeStartTime = new Date();

    fetchData(`${process.env.REACT_APP_API_URL}/jobs/${id}`, {
      data: {
        activeStartTime: activeStartTime.toISOString()
      }
    }, 'PUT')
      .then((job) => {
        console.log(job);
        setCurrentJob(job.data);
      })
  }

  const startJob = (e) => {
    e.preventDefault();
    setCurrentJob(job);
    setActiveStartTime();
  }

  useEffect(() => {
    if (id) {
      setLoading(true);
      console.log(id);
      getJob();
    }

    return () => {
      setLoading(false);
    }
  }, []);

  return (
    <div>
      <h1>Job Details</h1>
      {job !== null && job.hasOwnProperty('id') && <>
        <h2>{job.attributes.title}</h2>
        <ul>
          <li>Start: {formatDate(job.attributes.startTime)}</li>
          <li>End: {formatDate(job.attributes.endTime)}</li>
        </ul>
        {/* <p>Time available: {timeAvailable()}</p> */}

        <p><button onClick={startJob}>Start</button></p>
        <div>
          {job.attributes.description}
        </div>

        {/* <CountdownTimer targetDate={new Date().getTime() + availableSecs()} /> */}

        <h3>About the client</h3>

        <ul>
          <li>{job.attributes.client.data.attributes.name}</li>
          <li>{job.attributes.client.data.attributes.address}</li>
          <li>{job.attributes.client.data.attributes.description}</li>
        </ul>
      </>}
      {job === null && <p>Job not available</p>}
    </div>
  )
}

export default JobDetails;