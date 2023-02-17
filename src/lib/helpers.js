async function fetchData(url = '', data = {}, method = 'GET') {
  // Create basic headers.
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');

  // Check for existing token
  const token = localStorage.getItem('jm-access-token');
  if (token !== null) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  var options = {
    method: method,
    headers: headers
  };

  if ( (method === 'POST') || (method === 'PUT') ) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  return response.json();
}

function generateQueryString(params) {
  return Object.keys(params).map(key => key + '=' + params[key]).join('&');
}

function getTotalTimeInMiliseconds(startTime = '', endTime = '') {
  const startTimeDate = new Date(startTime);
  const endTimeDate = new Date(endTime);
  const milliseconds = Math.abs(startTimeDate.getTime() - endTimeDate.getTime());
  return milliseconds;
}

function formatDate(value, options = {
  weekday: "long",
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "EST",
  timeZoneName: "short"
}, locale = 'en-CA') {
  const date = new Date(value);
  return `${date.toLocaleTimeString(locale, options)}`;
}

export {
  fetchData,
  generateQueryString,
  getTotalTimeInMiliseconds,
  formatDate
};