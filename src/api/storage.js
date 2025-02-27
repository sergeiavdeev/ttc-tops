const api_host = import.meta.env.VITE_API_HOST;
const storageId = import.meta.env.VITE_STORAGE_ID;
const cors = import.meta.env.VITE_CORS;

export default {
  getInfo() {
    return fetch(`${api_host}/api/v1/storage/${storageId}`, {
      method: 'GET',
      credentials: 'omit',
      mode: cors
    })
      .then(res => res.json())
      .catch(err => console.log(err));
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
      mode: cors
    })
      .then(res => res.json())
      .catch(err => console.log(err));
  },

  createOrder(resourceId, date, startTime, endTime) {
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
    });
  },

  getOrders() {
    return fetch(`${api_host}/api/v1/order?admin=0`, {
      method: 'GET',
      credentials: 'include',
      mode: cors,
      headers: {
        "X-Requested-With": 'XMLHttpRequest'
      }
    })
      .then(res => res.json())
      .catch(err => console.log(err));
  },

  getOrdersAdmin() {
    return fetch(`${api_host}/api/v1/order?admin=1`, {
      method: 'GET',
      credentials: 'include',
      mode: cors,
      headers: {
        "X-Requested-With": 'XMLHttpRequest'
      }
    })
      .then(res => res.json())
      .catch(err => console.log(err));
  },

  getAmount(resourceId, count) {
    let urlParams = new URLSearchParams({
      resourceId: resourceId,
      count: count
    });
    return fetch(`${api_host}/api/v1/order/price?` + urlParams, {
      method: 'GET',
      credentials: 'include',
      mode: cors,
      headers: {
        "X-Requested-With": 'XMLHttpRequest'
      }
    })
      .then(res => res.text())
      .catch(err => console.log(err));
  },

  deleteOrder(id) {
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
      .catch(err => console.log(err));
  },

  orderPay(orderId, sum) {
    return fetch(`${api_host}/api/v1/order/pay`, {
      method: 'POST',
      credentials: 'include',
      mode: cors,
      headers: {
        "X-Requested-With": 'XMLHttpRequest',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderId: orderId,
        kt: sum
      })
    })
      .catch(err => console.log(err));
  }
}
