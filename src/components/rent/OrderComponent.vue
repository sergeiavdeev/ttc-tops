<script setup>

  import { useOrdersStore } from '@/stores/orders.js'

  const props = defineProps(['order'])
  const ordersStore = useOrdersStore();

  function deleteOrder(id) {
    ordersStore.deleteOrder(id);
  }

  function orderStatus(order) {
    let status = "Ожидает оплаты";
    if (order.debt === 0) {
      status = "Оплачен";
    }
    return status;
  }
</script>

<template>
  <div class="order_content">
    <div><b>Дата:</b> {{props.order.bookingDate.toLocaleString().split(',')[0]}}</div>
    <div><b>Аренда:</b> {{props.order.resource.name}} на {{props.order.duration}}</div>
    <div><b>Начало в:</b> {{props.order.startTime}}</div>
    <div><b>Сумма:</b> {{props.order.amount}}</div>
    <div><b>Статус:</b> {{orderStatus(props.order)}}</div>
    <button v-on:click="deleteOrder(props.order.id)">Отменить</button>
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

</style>
