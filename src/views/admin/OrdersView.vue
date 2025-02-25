<script setup>
import { onMounted, onUnmounted} from 'vue'
import BookingPlan from '@/components/admin/BookingPlan.vue'
import { useOrdersStore } from '@/stores/orders.js'
import { storeToRefs } from 'pinia'

const orderStore = useOrdersStore();

const {getOrdersAll} = storeToRefs(orderStore)

let timer = null;

onMounted(() => {
  orderStore.loadOrdersAdmin();
  timer = setInterval(() => {
    orderStore.loadOrdersAdmin();
  }, 60000)
})

onUnmounted(() => {
  clearInterval(timer);
})

</script>

<template>
  <section id="orders">
    <h1>Забронировано</h1>
    <div class="container">
      <div class="admin">
        <div class="resource-table" v-for="resource in getOrdersAll" v-bind:key="resource.id">
          <BookingPlan :resource="resource" v-if="resource.dates.length > 0"/>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
h1,
h2,
h3 {
  color: var(--color-dark);
}

.admin {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  padding-bottom: 20px;
}

.resource-table {
  display: flex;

}
</style>
