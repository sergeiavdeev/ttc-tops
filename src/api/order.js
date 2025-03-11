import { createRouterMatcher as Promise } from 'vue-router'
import commons from '@/api/commons.js'

const api_host = import.meta.env.VITE_API_HOST;
//const storageId = import.meta.env.VITE_STORAGE_ID;
const cors = import.meta.env.VITE_CORS;

export default {

  getAmount(resourceId, count) {
    let urlParams = new URLSearchParams({
      productId: resourceId,
      count: count
    });
    return fetch(`${api_host}/api/v2/tariff?` + urlParams, {
      method: 'GET',
      credentials: 'include',
      mode: cors,
      headers: {
        "X-Requested-With": 'XMLHttpRequest'
      }
    })
      .then(response => commons.handleHttpResponse(response))
      .catch(err => commons.handleError(err));
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
      .then(response => commons.handleHttpResponse(response, true))
      .catch(err => commons.handleError(err));
  }
}
