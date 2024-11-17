<script setup>
import { useCounterStore } from '../stores/counter'

const store = useCounterStore();

setInterval(() => {
  store.increment();
}, 1100)

</script>

<template>
  <section id="rent">
    <h1>Раздел находится в разработке</h1>
    <h2>Счетчик: {{store.count}}</h2>
  </section>
</template>

<style>
h1 {
  color: var(--color-dark);
}
</style>

