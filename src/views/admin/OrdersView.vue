<script setup>

import OrderComponent from '@/components/rent/OrderComponent.vue'
import { onMounted, ref } from 'vue'
import storage from '@/api/storage.js'

const orders = ref([]);

onMounted(() => {
  storage.getOrdersAdmin()
    .then(res => orders.value = res)
})
</script>

<template>
  <section id="orders">
    <h1>Забронировано</h1>
    <div class="container">
      <div class="orders">
        <div class="order" v-for="order in orders" v-bind:key="order.id">
          <h2>Заказ от: {{order.createdAt.split('T')[0]}}</h2>
          <OrderComponent :order="order" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>
