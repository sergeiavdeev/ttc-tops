import { defineStore } from 'pinia'
import userInfo from '@/api/userInfo.js'

export const useUserStore = defineStore('user', {
  state: () => ({
    info: {
      uuid: '',
      firstName: '',
      lastName: '',
      email: '',
      roles: []
    },
    isAuthenticated: false,
  }),
  actions: {
    async getUser() {
      let user = await userInfo.getUserInfo();
      this.info = { ...this.info, ...user }
      this.isAuthenticated = this.info.uuid == null ? false : true;
    },

    login() {
      userInfo.login();
    },

    logout() {
      userInfo.logout();
    }
  }
})
