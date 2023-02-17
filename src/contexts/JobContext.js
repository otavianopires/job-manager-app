import { createContext, useContext, useEffect, useState } from "react";
import { fetchData, generateQueryString, getTotalTimeInMiliseconds } from "../lib/helpers";

const JobContext = createContext({
  activeJob: null,
  setActiveJob: () => {},
  totalTimeInMiliseconds: null,
  isActive: null,
  setIsActive: () => {},
  isPaused: null,
  setIsPaused: () => {},
  time: null,
  setActiveJobStartTime: () => {},
  setActiveJobEndTime: () => {},
  referenceTime: null,
  setReferenceTime: () => {},
  pauseTime: null,
  setPauseTime: () => {},
  queryParams: null
});

export const JobProvider = ({ children }) => {
  const [activeJob, setActiveJob] = useState(null);
  const [totalTimeInMiliseconds, setTotalTimeInMiliseconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  const [time, setTime] = useState(0);
  const [referenceTime, setReferenceTime] = useState(0);
  const [pauseTime, setPauseTime] = useState(0);

  // Main query parameter needed on most job requests.
  const queryParams = {
    'fields[0]': 'title',
    'fields[1]': 'startTime',
    'fields[2]': 'endTime',
    'fields[3]': 'description',
    'fields[4]': 'totalJobTime',
    'fields[5]': 'activeStartTime',
    'fields[6]': 'activeEndTime',
    'fields[7]': 'active',
    'populate[client][fields][0]': 'name',
    'populate[client][fields][1]': 'address',
    'populate[client][fields][3]': 'description',
  };

  /**
   * Search for active job in the database and set as active job.
   */
  const searchForActiveJob = async () => {
    let params = {...queryParams, 'filters[active][$eq]': 'true'};
    const response = await fetchData(`${process.env.REACT_APP_API_URL}/jobs/?${generateQueryString(params)}`);

    if (response.data !== null && response.data.length > 0 && response.data[0].attributes.activeEndTime === null) {
      let theJob = response.data[0];
      setActiveJob(theJob);
      setIsActive(true);
      setIsPaused(true);
      setTime(parseInt(theJob.attributes.totalJobTime))
      const milliseconds = getTotalTimeInMiliseconds(theJob.attributes.startTime, theJob.attributes.endTime);
      setTotalTimeInMiliseconds(milliseconds);
    }
  }

  /**
   * Update job start time and set as active job.
   * @param {string} id the job entry id.
   */
  const setActiveJobStartTime = async (id) => {
    const activeStartTime = new Date();

    fetchData(`${process.env.REACT_APP_API_URL}/jobs/${id}?${generateQueryString(queryParams)}`, {
      data: {
        activeStartTime: activeStartTime.toISOString(),
        active: true
      }
    }, 'PUT')
      .then((response) => {
        setActiveJob(response.data);
        const activeStartTime = new Date(response.data.attributes.activeStartTime);
        setReferenceTime(activeStartTime.getTime())
        setIsActive(true);
        setIsPaused(false);
      })
  }

  /**
   * Store total worked time for the active job.
   */
  const setActiveJobWorkedTime = async () => {
    setIsPaused(true);
    const response = await fetchData(`${process.env.REACT_APP_API_URL}/jobs/${activeJob.id}?${generateQueryString(queryParams)}`, {
      data: {
        totalJobTime: time,
      }
    }, 'PUT');
    if (response.data !== null) {
      setActiveJob(response.data);
    }
  };

  /**
   * Store end time and total worked time for the active job.
   */
  const setActiveJobEndTime = async () => {
    setIsPaused(!isPaused);
    const activeEndTime = new Date();
    const response = await fetchData(`${process.env.REACT_APP_API_URL}/jobs/${activeJob.id}?${generateQueryString(queryParams)}`, {
      data: {
        activeEndTime: activeEndTime.toISOString(),
        totalJobTime: time,
        active: false
      }
    }, 'PUT');
    if (response.data !== null) {
      setIsActive(false);
      setTime(0);
      setActiveJob(null);
    }
  };

  /**
   * If a job was paused and is site is refreshed,
   * this function will try to retrieve an existing active job.
   */
  useEffect(() => {
    searchForActiveJob();
    return () => {};
  }, []);

  /**
   * Start Stopwatch if a job was activated.
   */
  useEffect(() => {
    let interval = null;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime(() => Date.now() - referenceTime)
      }, 100);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isActive, isPaused, time]);


  /**
   * Store worked time if a job is paused.
   */
  useEffect(() => {
    if (isActive && isPaused) {
      setActiveJobWorkedTime();
    }
    return () => {};
  }, [isActive, isPaused]);

  return (
    <JobContext.Provider value={{
      activeJob,
      setActiveJob,
      totalTimeInMiliseconds,
      isActive,
      setIsActive,
      isPaused,
      setIsPaused,
      time,
      setActiveJobStartTime,
      setActiveJobEndTime,
      referenceTime,
      setReferenceTime,
      pauseTime,
      setPauseTime,
      queryParams
    }}>
      {children}
    </JobContext.Provider>
  )
}

export const useJob = () => useContext(JobContext);