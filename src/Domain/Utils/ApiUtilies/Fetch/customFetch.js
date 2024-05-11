/**
 * Performs a customized HTTP fetch request using the Fetch API, including optional headers and authentication.
 *
 * @param {string} url - The URL to which the fetch request is made.
 * @param {string} [method='GET'] - The HTTP method for the request (GET, POST, PUT, DELETE, etc.).
 * @param {object|null} [body=null] - The request body data, typically an object that will be JSON-stringified.
 * @param {object} [headers] - Additional headers to include in the request.
 * @returns {Promise} - A Promise that resolves to the JSON response data if successful, or rejects with the response or error.
 */
export function customFetch(url, method = "GET", body = null, headers) {
  // Retrieve the token from local storage
  const token = localStorage.getItem("token");

  // Construct the options for the fetch request
  const requestOptions = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
      ...headers,
    },
    body: body ? JSON.stringify(body) : null,
  };

  // Perform the fetch request and return a Promise
  return new Promise((resolve, reject) => {
    fetch(url, requestOptions)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          reject(res);
        }
      })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
