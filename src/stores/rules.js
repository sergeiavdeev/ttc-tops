import { defineStore } from 'pinia'

export const useRulesStore = defineStore("rules", {
  state: () => ({
    rules: [
      {
        id: '32e76963-6cc5-47d9-98aa-246adf1e5ede',
        roles: ["user"],
        bookingByDayOfWeek: [
          //0 - воскресенье
          true, false, false, false, false, false, false
        ],
        bookingToday: false
      },
      /*
      {
        id: 'def45a47-7458-41ff-8b2c-acdab8821d84',
      }
      */
    ]
  }),

  getters: {
    getRules: (state) => {
      return (id, role) => {
        return state.rules.filter((rule) => rule.id === id && rule.roles.includes(role));
      }
    },
    getBookingByDayOfWeek: (state) => {
      return (id, role, dayOfWeek) => {
        const rules = state.getRules(id, role);
        if (rules && rules.length > 0) {
          return rules[0].bookingByDayOfWeek[dayOfWeek];
        }
        return true;
      }
    },
    getBookingToday: (state) => {
      return (id, role, date) => {
        const rules = state.getRules(id, role);
        if (rules && rules.length > 0) {
          let today = new Date();
          let tDate = new Date(date);
          let isDateToday = today.getDay() === tDate.getDay()
          && today.getMonth() === tDate.getMonth()
          && today.getFullYear() === tDate.getFullYear();
          return rules[0].bookingToday && isDateToday;
        }
        return true;
      }
    }
  }
})
