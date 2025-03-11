import { defineStore } from 'pinia'
import userApi from '@/api/userInfo.js'

export const useUserStore = defineStore('user', {
  state: () => ({
    info: {
      uuid: '',
      firstName: '',
      lastName: '',
      email: '',
      roles: [],
    },
    isAuthenticated: false,
  }),
  getters: {
    hasRole: (state) => {
      return (role) => state.info.roles.indexOf(role) !== -1
    },
    roles: (state) => state.info.roles,
    mainRole: (state) => {
      if (state.info.roles.includes('admin')) {
        return 'admin'
      } else if (state.info.roles.includes('owner')) {
        return 'owner'
      } else if (state.info.roles.includes('user')) {
        return 'user'
      }
      return null
    },
  },
  actions: {
    async getUser() {
      let user = await userApi.getUserInfo()
      this.info = { ...this.info, ...user }
      this.isAuthenticated = this.info.uuid != null
      if (!this.info.roles) {
        this.info.roles = []
      }
    },

    login() {
      userApi.login()
    },

    logout() {
      userApi.logout()
    },
  },
})
