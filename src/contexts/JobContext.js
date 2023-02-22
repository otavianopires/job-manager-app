import { createContext, useContext, useEffect, useState } from "react";
import { fetchData, generateQueryString } from "../lib/helpers";
import { useUser } from "./UserContext";

const JobContext = createContext({
  activeJob: null,
  setActiveJob: () => {},
  activeJobTime: null,
  setActiveJobTime: () => {},
  isActive: null,
  setIsActive: () => {},
  isPaused: null,
  setIsPaused: () => {},
  time: null,
  startJob: () => {},
  completeJob: () => {},
  startTime: null,
  setStartTime: () => {},
  pauseTime: null,
  setPauseTime: () => {},
  queryParams: null,
  jobTimeQueryParams: null,
  pauseJob: () => {},
  resumeJob: () => {}
});

export const JobProvider = ({ currentUser, children }) => {
  const [activeJob, setActiveJob] = useState(null);
  const [activeJobTime, setActiveJobTime] = useState(null);
  // const [totalTimeInMiliseconds, setTotalTimeInMiliseconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  const [time, setTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [pauseTime, setPauseTime] = useState(0);

  // Main query parameter needed on most job requests.
  const queryParams = {
    'fields[0]': 'title',
    'fields[1]': 'startTime',
    'fields[2]': 'endTime',
    'fields[3]': 'description',
    // 'fields[4]': 'totalJobTime',
    // 'fields[5]': 'activeStartTime',
    // 'fields[6]': 'activeEndTime',
    // 'fields[7]': 'active',
    'populate[0]': 'client',
    'populate[1]': 'job_times',
    'populate[2]': 'job_times.users_permissions_user',
  };

  // Main query parameter needed on most job requests.
  const jobTimeQueryParams = {
    'populate[0]': 'job',
    'populate[1]': 'job.client',
  };

  /**
   * Start new Job Time.
   * @param {string} id the job entry id.
   */
  const startJob = async (id) => {
    // Define start date time.
    const startTime = new Date();

    // Create new Job Time entry with start time, active to true, and job id.
    const response = await fetchData(`${process.env.REACT_APP_API_URL}/job-times/?${generateQueryString(jobTimeQueryParams)}`, {
      data: {
        startTime: startTime.toISOString(),
        active: true,
        job: id
      }
    }, 'POST');
    if (response.data !== null) {
      setActiveJobTime(response.data);
      setActiveJob(response.data.attributes.job.data);

      // Set startTime with the number of milliseconds since the epoch.
      setStartTime(startTime.getTime());

      setIsActive(true);
      setIsPaused(false);
    }
  }

  /**
   * Pause current Job Time.
   */
  const pauseJob = async () => {
    setIsPaused(true);

    // Update current Job Time totalJobTime with the tuccent stop watch time.
    const response = await fetchData(`${process.env.REACT_APP_API_URL}/job-times/${activeJobTime.id}`, {
      data: {
        totalJobTime: time
      }
    }, 'PUT');
    if (response.data !== null) {
      // Update activeJobTime.
      setActiveJobTime(response.data);

      // Create local storage item with the activeJobTime info, time, and pause status.
      localStorage.setItem('jm-active-job', JSON.stringify(
        {
          activeJobTime: activeJobTime,
          time: time,
          paused: true
        }
      ));
    }
  };

  /**
   * Resume a paused Job Time.
   */
  const resumeJob = () => {
    const startTime = new Date();

    // Refresh local storage item with the activeJobTime info, created date, and pause status.
    localStorage.setItem('jm-active-job', JSON.stringify(
      {
        activeJobTime: activeJobTime,
        createdAt: startTime,
        paused: false
      }
    ));

    // Retrieve the total job time from the activeJobTime.
    const totalWorkedTime = parseInt(activeJobTime.attributes.totalJobTime);

    // Calculate the total paused time and set as new startTime.
    const pauseTime = Date.now() - totalWorkedTime;
    setStartTime(pauseTime);

    // Calculate the total time based on the start time and the total worked time.
    const resumeTime = Date.now() - startTime.getTime();
    setTime(totalWorkedTime + resumeTime);

    setIsPaused(false);
  }

  /**
   * Store end time and total worked time for the active job.
   */
  const completeJob = async () => {
    // Pause stopwatch.
    setIsPaused(true);

    // Update current Job Time with the end date time, total job time, and set active to false.
    const endTime = new Date();
    const response = await fetchData(`${process.env.REACT_APP_API_URL}/job-times/${activeJobTime.id}`, {
      data: {
        endTime: endTime.toISOString(),
        totalJobTime: time,
        active: false
      }
    }, 'PUT');
    if (response.data !== null) {
      // Reset active job.
      setIsActive(false);
      setTime(0);
      setActiveJob(null);
      localStorage.removeItem('jm-active-job');
    }
  };

  /**
   * Search for active job in the database and set as active job.
   */
  const searchForActiveJob = async () => {
    // Search for active Job Time based from the current user.
    let filterJobTimeQueryParams = {
      ...jobTimeQueryParams,
      'filters[active][$eq]': 'true',
      'filters[users_permissions_user][id][$eq]': currentUser.id
    };
    const response = await fetchData(`${process.env.REACT_APP_API_URL}/job-times/?${generateQueryString(filterJobTimeQueryParams)}`);

    if (response.data !== null && response.data.length > 0 && response.data[0].attributes.endTime === null) {
      // Create new constants for Jod Time and Job.
      const theActiveJobTime = response.data[0];
      const theActiveJob = response.data[0].attributes.job.data;

      // Safe to activate job.
      setIsActive(true);


      const theStartTime = new Date(theActiveJobTime.attributes.startTime);
      if (theActiveJobTime.attributes.totalJobTime === null) {
        // Job Time was never paused and has not totalJobTime value stored.
        setStartTime(theStartTime.getTime())
        setIsPaused(false);
      } else {
        // Job Time is or was paused before and has totalJobTime value.

        // Get local storage item. If the stop watch was paused it is expected that the local storage item exists.
        const localActiveJob = JSON.parse(localStorage.getItem('jm-active-job'));

        // Check if local storage item exists and if it has a pause state as false.
        if (localActiveJob && localActiveJob.activeJobTime.id === theActiveJobTime.id && !localActiveJob.paused) {
          // Job Time is set to resume and has a created date. Use local storage data to calculate new startTime.
          const createdAt = new Date(localActiveJob.createdAt);
          const resumeTime = Date.now() - createdAt.getTime();
          const totalWorkedTime = parseInt(theActiveJobTime.attributes.totalJobTime);
          const pausedTime = Date.now() - totalWorkedTime - resumeTime;
          setStartTime(pausedTime);

          // Set updated time.
          setTime(totalWorkedTime + resumeTime);

          // Set pause to false to resume stop watch
          setIsPaused(false);
        } else {
          // Job Time is not paused.
          const totalWorkedTime = parseInt(theActiveJobTime.attributes.totalJobTime);
          const pausedTime = Date.now() - totalWorkedTime;
          setStartTime(pausedTime)
          setTime(totalWorkedTime)
        }
      }

      // Set state of activeJobTime and activeJob.
      setActiveJobTime(theActiveJobTime);
      setActiveJob(theActiveJob);
    }
  }

  /**
   * If a job was paused and is site is refreshed,
   * this function will try to retrieve an existing active job.
   */
  useEffect(() => {
    if (currentUser && currentUser.hasOwnProperty('id')) {
      searchForActiveJob();
    }
    return () => {};
  }, [currentUser]);

  /**
   * Start Stopwatch if a job was activated.
   */
  useEffect(() => {
    let interval = null;
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime(() => Date.now() - startTime)
      }, 100);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isActive, isPaused, time]);

  return (
    <JobContext.Provider value={{
      activeJob,
      setActiveJob,
      activeJobTime,
      setActiveJobTime,
      isActive,
      setIsActive,
      isPaused,
      setIsPaused,
      time,
      startJob,
      completeJob,
      startTime,
      setStartTime,
      pauseTime,
      setPauseTime,
      queryParams,
      jobTimeQueryParams,
      pauseJob,
      resumeJob
    }}>
      {children}
    </JobContext.Provider>
  )
}

export const useJob = () => useContext(JobContext);