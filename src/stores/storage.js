import { defineStore } from 'pinia'
import storage from '@/api/storage.js'
import commons from '@/api/commons.js'

const HOUR = 60 * 60 * 1000;
const MINUTE = 60 * 1000;

export const useStorageStore = defineStore('storage', {
  state: () => ({
    info: {
      //resources: [{id: "", workTimes: []}, {id: "", workTimes: []}],
      resources: [],
      contacts: [],
    },
  }),
  getters: {

    getResource: (state) => {
      return (resourceId) => state.info.resources.find((resource) => resource.id === resourceId);
    },

    getResources: (state) => {
      return () => state.info.resources;
    },

    getWorkTimesByResourceId: (state) => {
      return (resourceId, date) => {
        let result = [];
        let resource = state.info.resources.find((resource) => resource.id === resourceId);
        if (resource) {
          if (!resource.workTimes) {
            resource.workTimes = [];
          }
          let workTime = resource.workTimes.filter((workTime) => workTime.date === date);
          if (workTime && workTime.length > 0) {
            let intervals =  workTime[0].timeIntervals;
            if(!intervals) {
              return result;
            }
            for (let i = 0; i < intervals.length; i++) {
              let startTime = commons.getDate(intervals[i].startTime)
              let endTime = commons.getDate(intervals[i].endTime)
              let duration = (endTime.getHours() - startTime.getHours()) * 60 + endTime.getMinutes() - startTime.getMinutes()
              if (duration >= 60) {
                result.push(intervals[i]);
              }
            }
          }
        }
        return result;
      }
    },

    getTimeList: (state) => {
      return (resourceId, date, count) => {
        let list = [];
        let intervals = state.getWorkTimesByResourceId(resourceId, date);
        for (let i = 0; i < intervals.length; i++) {
          let startTime = commons.getDate(intervals[i].startTime)
          let endTime = commons.getDate(intervals[i].endTime)
          //endTime.setHours(endTime.getHours() - count)
          endTime.setTime(endTime.getTime() - count * HOUR);
          list.push(intervals[i].startTime)
          while (startTime < endTime) {
            startTime.setTime(startTime.getTime() + 30 * MINUTE);
            list.push((startTime.getHours() < 10 ? "0" + startTime.getHours() : startTime.getHours()) + ':' +
              (startTime.getMinutes() === 0 ? "00" : startTime.getMinutes())
            )
          }
        }
        return list;
      }
    },
    existFreeTime: (state) => {
      return (resourceId, date) => state.getWorkTimesByResourceId(resourceId, date).length > 0;

    },
    getMaxDuration: (state) => {
      return (resourceId, date, selectedTime) => {
        let workTime = state.getWorkTimesByResourceId(resourceId, date);
        let duration = 2;
        let startTimeMinutes = selectedTime.split(":")[0] * 60 + Number(selectedTime.split(":")[1]);
        for (let i = 0; i < workTime.length; i++) {
          let endTimeMinutes = workTime[i].endTime.split(":")[0] * 60 + Number(workTime[i].endTime.split(":")[1]);
          if(endTimeMinutes - startTimeMinutes > 0 && endTimeMinutes - startTimeMinutes < 120) {
            duration = (endTimeMinutes - startTimeMinutes) / 60;
            break;
          }
        }
        return duration;
      }
    }
  },
  actions: {
    async getInfo() {
      console.log('Storage:getInfo')
      this.info = await storage.getInfo();
    },

    async loadWorkTime(resourceId, date) {
      let resource = this.info.resources.find((resource) => resource.id === resourceId);
      if (!resource) {
        return;
      }
      if (!resource.workTimes) {
        resource.workTimes = [];
      }
      let workTime = resource.workTimes.find((wt) => wt.date === date);
      if (!workTime) {
        let workTimes = await storage.getWorkTime(resource.id, date);
        if (workTimes.dateWorkTimeList && workTimes.dateWorkTimeList.length > 0) {
          workTime = workTimes.dateWorkTimeList[0];
          resource.workTimes.push(workTime);
        }
      }
    },

    async updateWorkTime(resourceId, date) {
      let resource = this.info.resources.find((resource) => resource.id === resourceId);
      if (!resource.workTimes) {
        resource.workTimes = [];
      }
      let workTimes = await storage.getWorkTime(resource.id, date);
      let workTime = resource.workTimes.find((wt) => wt.date === date);
      if (workTimes.dateWorkTimeList && workTimes.dateWorkTimeList.length > 0) {
        if (!workTime) {
          resource.workTimes.push(workTimes.dateWorkTimeList[0]);
        } else {
          //resource.workTimes = resource.workTimes.filter((wt) => wt.date !== date);
          //resource.workTimes.push(workTimes.dateWorkTimeList[0]);
          Object.assign(workTime, workTimes.dateWorkTimeList[0]);
        }
      }
    }
  },
})
