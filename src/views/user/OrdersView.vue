<script setup>

import { computed, onMounted, ref } from 'vue'
import api from '@/api/storage.js'
import OrderComponent from '@/components/rent/OrderComponent.vue'
import { useUserStore } from '@/stores/user.js'
import { useStorageStore } from '@/stores/storage.js'
import { useOrdersStore } from '@/stores/orders.js'

const user = useUserStore();
const storage = useStorageStore();
const ordersStore = useOrdersStore();
const orders = computed(() => getOrders());


function getDurationText(startTime, endTime) {
  var duration = "";
  var start = startTime.split(':')[0] * 60 + Number(startTime.split(':')[1]);
  var end = endTime.split(':')[0] * 60 + Number(endTime.split(':')[1]);
  duration = (end - start) / 60;
  if (duration === 1) {
    return duration + " час"
  }
  return duration + " часа";
}

function getOrders() {
  let res = ordersStore.orders;
  for (var i = 0; i < res.length; i++) {
    res[i].createdAt = new Date(res[i].createdAt);
    res[i].bookingDate = new Date(res[i].bookingDate);
    res[i].duration = getDurationText(res[i].startTime, res[i].endTime);
    res[i].resource = storage.getResource(res[i].resourceId);
  }
  return res;
}

onMounted(() => {
  if (user.isAuthenticated) {
    ordersStore.getOrders();
  } else {
    user.login();
  }
})

</script>

<template>
  <section id="orders">
    <h1>Мои заказы</h1>
    <div class="container">
      <div class="orders">
        <div class="order" v-for="order in orders" v-bind:key="order.id">
          <h2>Заказ от: {{order.createdAt.toLocaleString()}}</h2>
          <OrderComponent :order="order" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  h1, h2, h3 {
    color: var(--color-dark);
    padding: 2rem;
  }

  .orders {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .order {
    padding: 10px;
    border-radius: 5px;
    border: 1px solid var(--color-light);
    -webkit-box-shadow: 4px 4px 8px 0 rgba(34, 60, 80, 0.2);
    -moz-box-shadow: 4px 4px 8px 0 rgba(34, 60, 80, 0.2);
    box-shadow: 4px 4px 8px 0 rgba(34, 60, 80, 0.2);
  }

</style>
