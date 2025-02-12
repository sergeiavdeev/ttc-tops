<script setup>
import { onMounted } from 'vue'
import OrderComponent from '@/components/rent/OrderComponent.vue'
import { useUserStore } from '@/stores/user.js'
import { useOrdersStore } from '@/stores/orders.js'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

const user = useUserStore()
const ordersStore = useOrdersStore()
const router = useRouter()

const {getOrders} = storeToRefs(ordersStore);

onMounted(() => {
  if (user.isAuthenticated) {
    ordersStore.loadOrders()
  } else {
    user.login()
  }
})
</script>

<template>
  <section id="orders">
    <h1>Мои заказы</h1>
    <div class="container">
      <div class="orders">
        <div class="order" v-for="order in getOrders" v-bind:key="order.id">
          <h2>Заказ от: {{ new Intl.DateTimeFormat('ru-RU', {timeStyle: 'short', dateStyle: 'long'}).format(order.createdAt) }}</h2>
          <OrderComponent :order="order" />
        </div>
        <button v-on:click="router.push('/rent')">Добавить</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
h1,
h2,
h3 {
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

button {
  font-size: 2rem;
  padding: 15px;
  border-radius: 5px;
  background-color: var(--color-light);
  color: var(--color-white);
  transition: color 0.3s ease-in-out;
}
</style>
