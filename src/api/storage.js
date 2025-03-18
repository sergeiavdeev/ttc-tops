import commons from '@/api/commons.js'

const api_host = import.meta.env.VITE_API_HOST;
const storageId = import.meta.env.VITE_STORAGE_ID;
const cors = import.meta.env.VITE_CORS;

const headers = {
  "X-Requested-With": 'XMLHttpRequest',
    'Content-Type': 'application/json'
}

export default {

  getInfo() {
    return fetch(`${api_host}/api/v1/storage/${storageId}`, {
      method: 'GET',
      credentials: 'omit',
      mode: cors,
    })
      .then(response => commons.handleHttpResponse(response))
      .catch(err => commons.handleError(err));
  },

  getWorkTime(resourceId, date) {
    let urlParams = '?' + new URLSearchParams({
      storage: storageId,
      resource: resourceId,
      date: date
    });
    return fetch(`${api_host}/api/v1/work-time/free` + urlParams, {
      method: 'GET',
      credentials: 'omit',
      mode: cors,
    })
      .then(response => commons.handleHttpResponse(response))
      .catch(err => commons.handleError(err));
  },

  getCalendars() {
    let urlParams = '?' + new URLSearchParams({
      owner: storageId
    });
    return fetch(`${api_host}/api/v1/calendar${urlParams}`, {
      method: 'GET',
      credentials: 'omit',
      mode: cors
    })
      .then(response => commons.handleHttpResponse(response))
      .catch(err => commons.handleError(err));
  },

  addCalendar(calendar) {
    return fetch(`${api_host}/api/v1/calendar`, {
      method: 'POST',
      credentials: 'include',
      mode: cors,
      headers: headers,
      body: JSON.stringify(calendar)
    }).then(response => commons.handleHttpResponse(response))
      .catch(err => commons.handleError(err));
  },

  updateInfo(info) {
    return fetch(`${api_host}/api/v1/storage`, {
      method: 'PATCH',
      credentials: 'include',
      mode: cors,
      headers: headers,
      body: JSON.stringify(info)
    }).then(response => commons.handleHttpResponse(response))
      .catch(err => commons.handleError(err));
  },

  getDeviations(calendarId) {
    return fetch(`${api_host}/api/v1/calendar/${calendarId}/deviation`, {
      method: 'GET',
      credentials: 'omit',
      mode: cors,
      headers: headers
    }).then(response => commons.handleHttpResponse(response))
      .catch(err => commons.handleError(err));
  },

  saveDeviation(calendarId, deviation) {
    return fetch(`${api_host}/api/v1/calendar/${calendarId}/deviation`, {
      method: 'POST',
      credentials: 'include',
      mode: cors,
      headers: headers,
      body: JSON.stringify(deviation)
    })
    .then(response => commons.handleHttpResponse(response))
    .catch(err => commons.handleError(err));
  },

  deleteDeviation(calendarId, date) {
    return fetch(`${api_host}/api/v1/calendar/${calendarId}/deviation/${date}`, {
      method: 'DELETE',
      credentials: 'include',
      mode: cors,
      headers: headers
    })
      .then(response => commons.handleHttpResponse(response, true))
      .catch(err => commons.handleError(err));
  }
}
