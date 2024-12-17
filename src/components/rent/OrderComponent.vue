<script setup>

  const props = defineProps(['order'])

</script>

<template>
  <div class="order_content">
    <div>Дата: {{props.order.bookingDate.toLocaleString().split(',')[0]}}</div>
    <div>Начало в: {{props.order.startTime}}</div>
    <div>Продолжительность: {{props.order.duration}}</div>
    <div>Статус: ожидает платы</div>
    <button>Отменить</button>
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
