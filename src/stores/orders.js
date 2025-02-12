import { defineStore } from 'pinia'
import api from '@/api/storage.js'
import commons from '@/api/commons.js'
import { useStorageStore } from '@/stores/storage.js'

export const useOrdersStore = defineStore("orders", {
  state: () => ({
    orders: [],
    ordersAll: []
  }),
  getters: {
    getOrders: state => {
      let src = state.orders;
      let res = [];
      const storageStore = useStorageStore();
      for (let i = 0; i < src.length; i++) {
        res.push({
          createdAt: new Date(src[i].createdAt + ".000+00:00"),
          bookingDate: new Date(src[i].bookingDate),
          duration: commons.getDurationText(src[i].startTime, src[i].endTime),
          resource: storageStore.getResource(src[i].resourceId),
          amount: src[i].amount,
          count: src[i].count,
          debt: src[i].debt,
          id: src[i].id,
          resourceId: src[i].resourceId,
          userId: src[i].userId,
          startTime: src[i].startTime,
        });
      }
      return res;
    },
    getOrdersAll: state => {
      const storageStore = useStorageStore();
      let data = []
      let resources = storageStore.getResources();
      for (let i = 0; i < resources.length; i++) {
        data.push({
          id: resources[i].id,
          name: resources[i].name,
          dates: [],
        })
      }
      let res = state.ordersAll;
      for (let i = 0; i < res.length; i++) {
        let resource = data.filter((item) => item.id === res[i].resourceId)[0];
        let date = resource.dates.filter((item) => item.date === res[i].bookingDate)[0];

        if (!date) {
          resource.dates.push({ date: res[i].bookingDate, bookings: []});
          date = resource.dates.filter((item) => item.date === res[i].bookingDate)[0];
        }

        date.bookings.push({
          id: res[i].id,
          startTime: res[i].startTime,
          endTime: res[i].endTime,
          firstName: res[i].user.firstName,
          lastName: res[i].user.lastName,
          email: res[i].user.email,
          debt: res[i].debt
        })
      }
      return data;
    }
  },
  actions: {

    async loadOrders() {
      this.orders = await api.getOrders();
    },

    async loadOrdersAdmin() {
      this.ordersAll = await api.getOrdersAdmin();
    },

    deleteOrder(id) {
      api.deleteOrder(id)
        .then((res) => {
          if (res.status === 200) {
            this.orders = this.orders.filter((order) => order.id !== id);
            this.ordersAll = this.ordersAll.filter((order) => order.id !== id);
          }
        })
    },

    payOrder(id, sum) {
      api.orderPay(id, sum)
        .then((res) => {
          if (res.status === 200) {
            this.loadOrdersAdmin()
              .then();
          }
        })
    }
  }
})
