import commons from '@/api/commons.js'

const api_host = import.meta.env.VITE_API_HOST;
const storageId = import.meta.env.VITE_STORAGE_ID;
const cors = import.meta.env.VITE_CORS;

export default {

  createBooking(resourceId, date, startTime, endTime) {
    return fetch(`${api_host}/api/v1/order`, {
      method: 'POST',
      credentials: 'include',
      mode: cors,
      headers: {
        "X-Requested-With": 'XMLHttpRequest',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        storageId: storageId,
        resourceId: resourceId,
        bookingDate: date,
        startTime: startTime,
        endTime: endTime
      })
    })
      .then(response => commons.handleHttpResponse(response))
      .catch(err => commons.handleError(err));
  },

  deleteBooking(id) {
    return fetch(`${api_host}/api/v1/order`, {
      method: 'DELETE',
      credentials: 'include',
      mode: cors,
      headers: {
        "X-Requested-With": 'XMLHttpRequest',
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        "id": id
      })
    })
      .then(response => commons.handleHttpResponse(response, true))
      .catch(err => commons.handleError(err));
  },

  getBookings(isAdmin) {

    if (!isAdmin) {
      isAdmin = 0;
    }
    let urlParams = '?' + new URLSearchParams({
      admin: isAdmin
    });

    return fetch(`${api_host}/api/v1/order${urlParams}`, {
      method: 'GET',
      credentials: 'include',
      mode: cors,
      headers: {
        "X-Requested-With": 'XMLHttpRequest'
      }
    })
      .then(respose => commons.handleHttpResponse(respose))
      .catch(err => commons.handleError(err));
  },
}
