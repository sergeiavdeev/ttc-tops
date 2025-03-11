<script setup>
  import IconError from '@/components/icons/IconError.vue'
  import IconClose from '@/components/icons/IconClose.vue'

  defineProps(['error']);
  defineEmits(['closeError']);


</script>

<template>
  <div class="error">
    <div class="error-header">
      Ошибка получения данных
      <IconClose v-on:click="$emit('closeError')" />
    </div>
    <IconError class="error-icon" />
    <div class="error-content">
      <div class="error-content-row">Описание: {{error.message}}</div>
      <div class="error-content-row">Код: {{error.httpStatus}}</div>
      <div class="error-content-row">Стек: {{error.stacktrace}}</div>
    </div>
    <button v-on:click="$emit('closeError')">Закрыть</button>
  </div>
</template>

<style scoped>
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  max-width: 640px;
  position: absolute;
  bottom: var(--footer-height);
  right: 0;
  z-index: 50;
  background-color: white;
  border-radius: 5px;
  border: 1px solid var(--color-light);
  -webkit-box-shadow: 4px 4px 8px 0 rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 4px 4px 8px 0 rgba(34, 60, 80, 0.2);
  box-shadow: 4px 4px 8px 0 rgba(34, 60, 80, 0.2);
  margin: 10px;
  font-size: 2rem;
}

.error-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-light);
  width: 100%;
  padding: 5px;
}

.error-icon {
  width: 5rem;
  height: 5rem;
  filter: brightness(0) saturate(100%) invert(15%) sepia(77%) saturate(5144%) hue-rotate(356deg) brightness(122%) contrast(132%);;
}

.error-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 1.5rem;
  padding: 1rem;
}

button {
  font-size: 2rem;
  padding: 10px;
  border-radius: 5px;
  background-color: var(--color-light);
  color: var(--color-white);
  transition: color 0.3s ease-in-out;
  margin-bottom: 1.5rem;
}
</style>
