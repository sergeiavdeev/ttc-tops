<script setup>
import { onMounted, ref } from 'vue'
import BookingComponent from '@/components/rent/BookingComponent.vue'
import bookingApi from '@/api/booking.js'
import { useRouter } from 'vue-router'
import LoadingView from '@/components/LoadingView.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import { useStorageStore } from '@/stores/storage.js'

const storage = useStorageStore();
const router = useRouter();

const bookings = ref([]);
const loading = ref(false);
const error = ref({});
const isError = ref(false);

onMounted(() => {
  loadBookings();
})

storage.$subscribe((mutation, state) => {
  if (state.doUpdate.order) {
    loadBookings();
    storage.setDoUpdate({
      order: false,
      workTime: false
    });
  }
});

async function loadBookings() {
  loading.value = true;
  let result = await bookingApi.getBookings()
  loading.value = false;
  isError.value = result.isError;
  if (!result.isError) {
    bookings.value = result.data;
  } else {
    error.value = result.data;
  }
}

async function deleteBooking(id) {
  loading.value = true;
  let result = await bookingApi.deleteBooking(id);
  loading.value = false;
  isError.value = result.isError;
  if (!result.isError) {
    bookings.value = bookings.value.filter((item) => item.id !== id);
  } else {
    error.value = result.data;
  }
}

</script>

<template>
  <section id="orders">
    <h1>Мои заказы</h1>
    <div class="container">
      <div class="orders">
        <div class="order" v-for="booking in bookings" v-bind:key="booking.id">
          <h2>Заказ от: {{ new Intl.DateTimeFormat('ru-RU', {timeStyle: 'short', dateStyle: 'long'}).format(new Date(booking.createdAt + ".000+00:00")) }}</h2>
          <BookingComponent :booking="booking" @deleteBooking="deleteBooking" :disabled="loading"/>
        </div>
        <button v-on:click="router.push('/rent')" >Добавить</button>
      </div>
      <LoadingView v-if="loading"/>
      <ErrorComponent v-if="isError" :error="error" @closeError="isError=false" />
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
