const api_host = import.meta.env.VITE_API_HOST;
const cors = import.meta.env.VITE_API_CORS;

export default {
  getUserInfo() {
    return fetch(api_host + '/user/info', {
      method: 'GET',
      mode: cors,
      credentials: 'include'
    }).then(res => res.json())
  },

  login() {
    window.location.href = api_host + '/oauth2/authorization/keycloak'
  },

  logout() {
    window.location.href = api_host + '/logout'
  }
}
