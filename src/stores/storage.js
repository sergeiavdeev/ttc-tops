import { defineStore } from 'pinia'
import storage from '@/api/storage.js'

export const useStorageStore = defineStore('storage', {
  state: () => ({
    info: {
      resources: [],
      workTime: []
    },
  }),
  actions: {

    async getInfo() {
      console.log('Storage:getInfo')
      this.info = await storage.getInfo()
    },

    // async getFreeWorkTime(resourceId, date) {
    //   console.log('Storage:getFreeWorkTime');
    //   let result = await storage.getFreeWorkTime(resourceId, date);
    //   result['resourceId'] = resourceId;
    //   let i = this.workTime.findIndex(item => item.resorceId === resourceId);
    //   if (i === -1) {
    //     this.workTime.add(result);
    //   } else {
    //     this.workTime[i] = result;
    //   }
    // }
  },
})
