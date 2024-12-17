<script setup>

import { onMounted, ref } from 'vue'
import storage from '@/api/storage.js'
import OrderComponent from '@/components/rent/OrderComponent.vue'

const orders = ref([]);

onMounted(() => {
  storage.getOrders()
    .then(res => orders.value = res)
})

</script>

<template>
  <section id="orders">
    <h1>Мои заказы</h1>
    <div class="container">
      <div class="orders">
        <div class="order" v-for="order in orders" v-bind:key="order.id">
          <h2>Заказ от: {{order.createdAt}}</h2>
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
