<script setup>
import { computed, onMounted, onUnmounted} from 'vue'
import { useStorageStore } from '@/stores/storage.js'
import BookingPlan from '@/components/admin/BookingPlan.vue'
import { useOrdersStore } from '@/stores/orders.js'

const resources = computed(() => getOrders())
const storage = useStorageStore()
const orderStore = useOrdersStore();

let timer = null;

onMounted(() => {
  orderStore.getOrdersAdmin();
  timer = setInterval(() => {
    orderStore.getOrdersAdmin();
  }, 10000)
})

onUnmounted(() => {
  clearInterval(timer);
})

function getOrders() {
  let data = []
  for (let i = 0; i < storage.info.resources.length; i++) {
    data.push({
      id: storage.info.resources[i].id,
      name: storage.info.resources[i].name,
      dates: [],
    })
  }
  let res = orderStore.ordersAll;
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

</script>

<template>
  <section id="orders">
    <h1>Забронировано</h1>
    <div class="container">
      <div class="admin">
        <div class="resource-table" v-for="resource in resources" v-bind:key="resource.id">
          <BookingPlan :resource="resource" />
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
}
</style>
