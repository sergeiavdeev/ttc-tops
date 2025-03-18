<script setup>
  import ContactLink from '@/components/links/ContactLink.vue'
   import commons from '../../api/commons.js'
  import bookingApi from '@/api/booking.js'
  import orderApi from '@/api/order.js'
  import { ref } from 'vue'
  import LoadingView from '@/components/LoadingView.vue'
  import ErrorComponent from '@/components/ErrorComponent.vue'

  defineProps(['resource', 'bookings']);
  const emit = defineEmits(['deleteBooking', 'orderPay']);

  const loading = ref(false);
  const isError = ref(false);
  const error = ref({});

  async function deleteOrder(id) {
    loading.value = true;
    let result = await bookingApi.deleteBooking(id);
    loading.value = false;
    isError.value = result.isError;
    if (result.isError) {
      error.value = result.data;
    } else {
      emit('deleteBooking', id);
    }
  }

  async function payOrder(id, orderId, sum) {
    loading.value = true;
    let result = await orderApi.orderPay(id, sum);
    loading.value = false;
    isError.value = result.isError;
    if (result.isError) {
      error.value = result.data;
    } else {
      loading.value = true;
      result = await orderApi.orderPayV2(orderId, sum);
      loading.value = false;
      isError.value = result.isError;
      if (result.isError) {
        error.value = result.data;
      } else {
        emit('orderPay', id, sum);
      }
    }
  }

  /*
  function debt(order) {
    if (order && order.debts) {
      return order.debts.reduce((total, debt) => total + (debt.dt - debt.kt), 0);
    }
    return 0;
  }
  */

</script>

<template>
  <div class="resource-plan" v-if="bookings.length > 0">
    <h2>{{resource.name}}</h2>
    <div class="plan-grid">
      <div v-for="date in new Set(bookings.map(booking => booking.bookingDate))" :key="date">
        <h3>{{commons.formatDate(date)}}</h3>
        <div v-for="booking in bookings.filter(booking => booking.bookingDate === date)" :key="booking.startTime" class="booking-row">
          <div>{{booking.startTime}} - {{booking.endTime}}</div>
          <a v-bind:href="'mailto:' + booking.user.email">{{booking.user.firstName}} {{booking.user.lastName}}</a>
          <!--<div><a v-bind:href="'mailto:' + booking.email">{{booking.email}}</a></div>-->
          <div class="align-end">{{booking.debt}}</div>
          <div class="grid-controls">
            <ContactLink img="accept" v-on:click="payOrder(booking.id, booking.order.id, booking.debt)" v-if="booking.debt > 0 && !loading"/>
            <ContactLink img="cancel" v-on:click="deleteOrder(booking.id)" v-if="!loading"/>
          </div>
        </div>
      </div>
    </div>
    <LoadingView v-if="loading"/>
    <ErrorComponent v-if="isError" :error="error" @closeError="isError=false"/>
  </div>
</template>

<style scoped>
.resource-plan {
  max-width: 600px;
}
h3 {
  background-color: var(--color-light);
  color: white;
  padding: 10px 0 10px 0;
}

.booking-row {
  display: grid;
  grid-template-columns: 12rem 3fr 1fr 1fr;
  align-items: center;
  gap: 2rem;
  font-size: 1.8rem;
  padding: 10px 0 10px 5px;
}

.plan-grid {
  display: grid;
  border-radius: 5px;
  border: 1px solid var(--color-light);
  -webkit-box-shadow: 4px 4px 8px 0 rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 4px 4px 8px 0 rgba(34, 60, 80, 0.2);
  box-shadow: 4px 4px 8px 0 rgba(34, 60, 80, 0.2);
}

.grid-controls {
  display: flex;
  gap: 1rem;
  flex-direction: row;
  justify-content: end;
  min-height: 24px;
  min-width: 96px;
}

.align-end {
  text-align: end;
}

a {
  color: var(--color-dark);
}

a:hover {
  color: var(--color-light);
}
</style>
