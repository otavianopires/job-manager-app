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

  console.log(options)

  const response = await fetch(url, options);

  return response.json();
}

function generateQueryString(params) {
  return Object.keys(params).map(key => key + '=' + params[key]).join('&');
}

export {
  fetchData,
  generateQueryString
};