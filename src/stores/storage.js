import { defineStore } from 'pinia'
import storage from '@/api/storage.js'

export const useStorageStore = defineStore('storage', {
  state: () => ({
    info: {
      resources: [],
      contacts: []
    },
  }),
  actions: {

    async getInfo() {
      console.log('Storage:getInfo')
      this.info = await storage.getInfo()
    },

    getResource(id) {
      return this.info.resources.find((item) => item.id === id);
    }
  },
})
