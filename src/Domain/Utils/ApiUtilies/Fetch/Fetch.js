// import jwt_decode from 'jwt-decode';
// import { BACKEND_URL } from '../../../Redux/Paths';
// import { FETCH_WHITE_LIST, FETCH_ERRORS, STATUS_CODE } from '../../../Settings/Constants/Constants';

import { customFetch } from "./customFetch";

const BACKEND_URL = '';
const {FETCH_WHITE_LIST, FETCH_ERRORS, STATUS_CODE} ={};

const DEFAULT_TOKEN = '75853e402747730aaffc3c3b2fbb687cc46111da';

const getRecaptcha = () => window.localStorage.getItem('reCaptcha');

// TODO: Is here temporarily
const isTokenValid = (decodedToken) => {
  const currentTime = Date.now() / 1000; // Convert to seconds
  if (decodedToken.exp < currentTime) {
    window.localStorage.clear();
    window.location.href = `${FRONTENDLMS_URL}/login`;
  }
};

const getToken = (isUserToken = false) => {
  // TODO: Pendiente validar por qué en la implementación ya existente utiliza Bearer con un token personalizado
  let token = `Token ${DEFAULT_TOKEN}`;
  if (isUserToken && window.localStorage.getItem('token')) {
    token = `Bearer ${window.localStorage.getItem('token')}`;
  }
  return token;
};

const makeURL = (path, params = {}, backendUrl = BACKEND_URL) => {
  let queryParamsStr = new URLSearchParams(params);
  !!queryParamsStr && (queryParamsStr = `?${queryParamsStr}`);
  const url = `${backendUrl}${path}${queryParamsStr}`;
  return url;
};

const _GET = (path, params = {}) => {
  // const decodedToken = jwt_decode(getToken(true));
  // isTokenValid(decodedToken);
  // console.log('🔍🔎', decodedToken);
  const url = makeURL(path, params);
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getToken(true),
      reCaptcha: getRecaptcha()
    }
  };
  const request = window.fetch(url, options);

  return request;
};

const __GET = (path, params = {}) =>
  new Promise((resolve, reject) => {
    const request = _GET(path, params);
    request
      .then((data) => {
        // Trabaja con los datos de la promesa anterior resuelta (resolve)
        if (!data.ok) {
          throw new Error(`{"message": "Error en la solicitud", "status": ${data.status}}`);
        }
        return data.json();
      })
      .then((data) => {
        // Trabaja con los datos de la promesa anterior resuelta (resolve)
        resolve(data);
      })
      .catch((error) => {
        //Maneja el error si la cadena de promesas falla (reject)
        reject(error);
      });
  });

/*
 * @Authors: @EdiedRamos - @JuanSebatian - @JuanCarlos
 * Recursive function to handle the fetch errors, making another call
 * until to get a good result or reach the max iteration count
 */
const apiSaveCaller = async (apiCall, path, params = {}, counter, maxIteration) => {
  if (counter === maxIteration) {
    return new Promise((_, error) => {
      console.debug(FETCH_ERRORS.MAX_ITERATION(path, STATUS_CODE.HTTP_500_INTERNAL_SERVER_ERROR));
      return error();
    });
  }
  try {
    const response = await apiCall(path, params);
    return response;
  } catch (Exception) {
    const ErrorData = JSON.parse(Exception.message);
    if (FETCH_WHITE_LIST.includes(ErrorData.status)) {
      return apiSaveCaller(apiCall, path, params, counter + 1, maxIteration);
    } else {
      return new Promise((_, error) => {
        console.debug(FETCH_ERRORS.IN_THE_WHITE_LIST(path, ErrorData.status));
        return error();
      });
    }
  }
};

const GET = (path, params = {}) => {
  return apiSaveCaller(__GET, path, params, 0, 3);
};

const _POST = (path, body = {}, params = {}) => {
  const url = makeURL(path, params);
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getToken(true),
      reCaptcha: getRecaptcha()
    },
    body: JSON.stringify(body)
  };

  const request = window.fetch(url, options);

  return request;
};

const POST = (path, body = {}, params = {}) =>
  new Promise((resolve, reject) => {
    const request = _POST(path, body, params);

    request
      .then((data) => {
        if (!data.ok) {
          // La solicitud falló con un código de respuesta 400 o superior
          throw new Error('Error en la solicitud');
        }
        return data.json();
      })
      .then((data) => resolve(data))
      .catch((error) => {
        console.debug('>>>> HttpClient.POST: error=', error);
        reject(error);
      });
  });

const _PUT = (path, body = {}, params = {}, isUserToken = false) => {
  const url = makeURL(path, params);
  const request = fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getToken(true),
      reCaptcha: getRecaptcha()
    },
    body: JSON.stringify(body)
  });
  return request;
};

const PUT = (path, body = {}, params = {}, isUserToken = false) =>
  new Promise((resolve, reject) => {
    const request = _PUT(path, body, params, isUserToken);
    // INFO: 'status' === HTTP_STATUS
    request
      .then((data) => {
        if (!data.ok) {
          // La solicitud falló con un código de respuesta 400 o superior
          throw new Error('Error en la solicitud');
        }
        return data.json();
      })
      .then((response) => resolve(response))
      .catch((error) => {
        console.debug('>>>> HttpClient.POST: error=', error);
        reject(error);
      });
  });

const _PATCH = (path, body = {}, params = {}, isUserToken = false) => {
  const url = makeURL(path, params);
  const request = fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getToken(true),
      reCaptcha: getRecaptcha()
    },
    body: JSON.stringify(body)
  });
  return request;
};

const PATCH = (path, body = {}, params = {}, isUserToken = true) =>
  new Promise((resolve, reject) => {
    const request = _PATCH(path, body, params, isUserToken);
    // INFO: 'status' === HTTP_STATUS
    request
      .then((data) => {
        if (!data.ok) {
          // La solicitud falló con un código de respuesta 400 o superior
          throw new Error('Error en la solicitud');
        }
        return data.json();
      })
      .then((response) => resolve(response))
      .catch((error) => {
        console.debug('>>>> HttpClient.PATCH: error=', error);
        reject(error);
      });
  });

const _DELETE = (path, body = {}, params = {}, isUserToken = false) => {
  const url = makeURL(path, params);
  const request = fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getToken(true),
      reCaptcha: getRecaptcha()
    },
    body: JSON.stringify(body)
  });
  return request;
};

const DELETE = (path, body = {}, params = {}, isUserToken = true) =>
  new Promise((resolve, reject) => {
    const request = _DELETE(path, body, params, isUserToken);
    // INFO: 'status' === HTTP_STATUS
    request
      .then((data) => {
        if (!data.ok) {
          // La solicitud falló con un código de respuesta 400 o superior
          throw new Error('Error en la solicitud');
        }
        return data.json();
      })
      .then((response) => resolve(response))
      .catch((error) => {
        console.debug('>>>> HttpClient.POST: error=', error);
        reject(error);
      });
  });

export const HttpClient = {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE
};
