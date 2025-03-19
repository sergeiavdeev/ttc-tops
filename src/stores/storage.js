import { defineStore } from 'pinia'
import storageApi from '@/api/storage.js'
import commons from '@/api/commons.js'

const HOUR = 60 * 60 * 1000;
const MINUTE = 60 * 1000;

export const useStorageStore = defineStore('storage', {
  state: () => ({
    info: {
      id: "",
      owner: "",
      name: "",
      address: "",
      //resources: [{id: "", workTimes: []}, {id: "", workTimes: []}],
      resources: [],
      contacts: [],
      calendars: [],
      deviations: []
    },
    loading: false,
    isError: false,
    error: {
      httpStatus: 0,
      message: "",
      stackTrace: ""
    },
    doUpdate: {
      order: false,
      workTime: false,
    }
  }),
  getters: {

    getInfo: (state) => state.info,
    getContacts: (state) => state.info.contacts,
    getDeviations: (state) => {
      return (calendarId) => state.info.deviations.filter(deviation => deviation.calendarId === calendarId)
        .sort((a, b) => {
          if (a.date > b.date) {
            return 1;
          } else if (a.date < b.date) {
            return -1;
          }
          return 0;
        });
    },
    getResource: (state) => {
      return (resourceId) => state.info.resources.find((resource) => resource.id === resourceId);
    },

    getResources: (state) => state.info.resources,

    getCalendars: (state) => state.info.calendars,

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
          if (startTime <= endTime) {
            list.push(intervals[i].startTime);
          }
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
    async loadInfo() {
      this.loading = true;
      let res = await storageApi.getInfo();
      this.loading = false;
      this.isError = res.isError;
      if (!res.isError) {
        this.info = {...this.info, ...res.data};
        this.doUpdate = {
          order: true,
          workTime: false
        };
        res = await storageApi.getCalendars();
        this.loading = false;
        this.isError = res.isError;
        if (!res.isError) {
          this.info.calendars = res.data;
          if (res.data.length > 0) {
            this.loading = true;
            res = await storageApi.getDeviations(res.data[0].id);
            this.loading = false;
            this.isError = res.isError;
            if (!res.isError) {
              this.info.deviations = res.data;
            } else {
              this.error = res.data;
            }
          }
        } else {
          this.error = res.data;
        }
      } else {
        this.error = res.data;
      }
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
        this.loading = true;
        let res = await storageApi.getWorkTime(resource.id, date);
        this.loading = false;
        let workTimes;
        this.isError = res.isError;
        if (!res.isError) {
          workTimes = res.data;
          if (workTimes.dateWorkTimeList && workTimes.dateWorkTimeList.length > 0) {
            workTime = workTimes.dateWorkTimeList[0];
            resource.workTimes.push(workTime);
          }
        } else {
          this.error = res.data;
        }
      }
    },

    async updateWorkTime(resourceId, date) {
      let resource = this.info.resources.find((resource) => resource.id === resourceId);
      if (!resource.workTimes) {
        resource.workTimes = [];
      }
      let workTimes;
      this.loading = true;
      let res= await storageApi.getWorkTime(resource.id, date);
      this.loading = false;
      if (!res.isError) {
        workTimes = res.data;
        let workTime = resource.workTimes.find((wt) => wt.date === date);
        if (workTimes.dateWorkTimeList && workTimes.dateWorkTimeList.length > 0) {
          if (!workTime) {
            resource.workTimes.push(workTimes.dateWorkTimeList[0]);
          } else {
            Object.assign(workTime, workTimes.dateWorkTimeList[0]);
          }
        }
      } else {
        this.error = res.data;
      }
    },

    addDeviation(deviation) {
      this.info.deviations.push(deviation);
    },

    deleteDeviation(calendarId, date) {
      this.info.deviations = this.info.deviations.filter(deviation => !(deviation.date === date && deviation.calendarId === calendarId));
    },

    setDoUpdate(doUpdate) {
      this.doUpdate = doUpdate;
    }
  },
})
