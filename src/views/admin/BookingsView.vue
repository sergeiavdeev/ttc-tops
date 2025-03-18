<script setup>
import { computed, onMounted, ref } from 'vue'
import BookingPlan from '@/components/admin/BookingPlan.vue'
import { storeToRefs } from 'pinia'
import ErrorComponent from '@/components/ErrorComponent.vue'
import LoadingView from '@/components/LoadingView.vue'
import booking from '@/api/booking.js'
import ordersApi from '@/api/order.js'
import { useStorageStore } from '@/stores/storage.js'

const storage = useStorageStore();
const {getResources} = storeToRefs(storage);

const bookings = ref([]);
const error = ref({});
const loading = ref(false);
const isError = ref(false);

const bookingsByResourceId = computed(() => {
  return (resourceId) => bookings.value.filter((booking) => booking.resourceId === resourceId);
});

onMounted(() => {
  loadBookings();
})

async function loadBookings() {
  loading.value = true;
  let result = await booking.getBookingsAll(getResources.value.map(resource => resource.id));
  loading.value = false;
  isError.value = result.isError;
  if (result.isError) {
    error.value = result.data;
  } else {
    bookings.value = await Promise.all(result.data.map(booking => {
      return ordersApi.getOrderByBookingId(booking.id)
        .then(res => {
          if (!res.isError) {
            booking.order = res.data;
          }
          return booking;
        });
    }));
  }
}

function deleteBooking(id) {
  bookings.value = bookings.value.filter((booking) => booking.id !== id)
}

function orderPay(id) {
  bookings.value = bookings.value.map((booking) => {
    if (booking.id === id) {
      booking.debt = 0;
    }
    return booking;
  })
}

storage.$subscribe((mutation, state) => {
  if (state.doUpdate.order) {
    loadBookings();
    storage.setDoUpdate({
      order: false,
      workTime: false
    });
  }
});

</script>

<template>
    <div class="container">
      <div class="admin">
        <div class="resource-table" v-for="resource in getResources" v-bind:key="resource.id">
          <BookingPlan :resource="resource" :bookings="bookingsByResourceId(resource.id)"
            @deleteBooking="deleteBooking"
            @orderPay="orderPay"
          />
        </div>
      </div>
      <LoadingView v-if="loading"/>
      <ErrorComponent v-if="isError" v-bind:error="error"  @closeError="isError=false" />
    </div>
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
  padding-top: 20px;
}

.resource-table {
  display: flex;
}
</style>
