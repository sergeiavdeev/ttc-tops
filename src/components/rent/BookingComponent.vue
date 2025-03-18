<script setup>

  import { useStorageStore } from '@/stores/storage.js'
  import { storeToRefs } from 'pinia'
  import commons from '@/api/commons.js'
  import ordersApi from '@/api/order.js'
  import { onMounted, ref } from 'vue'

  const props = defineProps(['booking', 'disabled'])
  defineEmits(['deleteBooking'])

  const storageStore = useStorageStore();
  const {getResource} = storeToRefs(storageStore)
  const order = ref({});

  onMounted(() => {
    ordersApi.getOrderByBookingId(props.booking.id).then((res) => {
      if (!res.isError) {
        order.value = res.data;
      }
    })
  });

  function orderStatus() {
    let status = "Ожидает оплаты";
    if (debt() === 0) {
      status = "Оплачен";
    }
    return status;
  }

  function amount() {
    if (order.value.products) {
      return order.value.products.reduce((total, product) => total + product.sum, 0);
    }
    return 0;
  }

  function debt() {
    if (order.value.debts) {
      return order.value.debts.reduce((total, debt) => total + (debt.dt - debt.kt), 0);
    }
    return 0;
  }
</script>

<template>
  <div class="order_content">
    <div><b>Дата:</b> {{new Intl.DateTimeFormat('ru-RU', {dateStyle: 'long'}).format(new Date(booking.bookingDate))}}</div>
    <div><b>Аренда:</b> {{getResource(booking.resourceId).name}} на {{commons.getDurationText(booking.startTime, booking.endTime)}}</div>
    <div><b>Начало в:</b> {{booking.startTime}}</div>
    <div><b>Сумма:</b> {{amount()}}</div>
    <div><b>Статус:</b> {{orderStatus()}}</div>
    <button v-on:click="$emit('deleteBooking', booking.id)" :disabled="disabled">Отменить</button>
  </div>
</template>

<style scoped>
  .order_content {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    font-size: 2rem;
    gap: 2rem;
  }

  button {
    font-size: 2rem;
    padding: 15px;
    border-radius: 5px;
    background-color: var(--color-light);
    color: var(--color-white);
    transition: color 0.3s ease-in-out;
  }

  button:hover {
    color: white;
  }

  button:disabled {
    background-color: var(--color-white);
    border-color: var(--color-light);
    border-style: solid;
    color: var(--color-light);
  }

</style>
