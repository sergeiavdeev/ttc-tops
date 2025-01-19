import { defineStore } from 'pinia'
import api from '@/api/storage.js'

export const useOrdersStore = defineStore("orders", {
  state: () => ({
    orders: [],
    ordersAll: []
  }),
  actions: {

    async getOrders() {
      this.orders = await api.getOrders();
    },

    async getOrdersAdmin() {
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
            this.getOrdersAdmin();
          }
        })
    }
  }
})
