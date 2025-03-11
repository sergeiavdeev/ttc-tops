<script setup>
import { useStorageStore } from '@/stores/storage.js'
import TableComponent from '@/components/rent/TableComponent.vue'
import LoadingView from '@/components/LoadingView.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'

const storageStore = useStorageStore();

</script>

<template>
  <section id="rent">
    <h1>Бронирование столов</h1>
    <div class="container">
      <div class="rent">
        <div v-for="resource in storageStore.info.resources" v-bind:key="resource.id">
          <TableComponent :resource-id=resource.id :collapse="false"/>
        </div>
      </div>
      <LoadingView v-if="storageStore.loading"/>
      <ErrorComponent v-if="storageStore.isError" v-bind:error="storageStore.error" @closeError="storageStore.isError = false" />
    </div>
  </section>
</template>

<style scoped>
h1 {
  color: var(--color-dark);
  padding: 1rem 0 0 0;
}

.rent {
  display: grid;
  grid-template-columns: 1fr 1fr;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 2rem;
}

@media (max-width: 800px) {
  .rent {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>

