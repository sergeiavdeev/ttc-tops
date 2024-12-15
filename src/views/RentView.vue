<script setup>
import { useStorageStore } from '@/stores/storage.js'
import TableComponent from '@/components/rent/TableComponent.vue'

const storageInfo = useStorageStore();

</script>

<template>
  <section id="rent">
    <h1>Бронирование столов</h1>
    <div class="container">
      <div class="rent">
        <div v-for="resource in storageInfo.info.resources" class="rent-resource" v-bind:key="resource.id">
          <h2>
            {{ resource.name }} ({{resource.description}})
          </h2>
          <TableComponent v-bind:resource-id=resource.id />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
h1 {
  color: var(--color-dark);
}

h2 {
  padding: 30px;
}

.rent {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 30px;
}

.rent-resource {
  display: flex;
  align-items: center;
  flex-direction: column;
  border: 1px solid var(--color-light);
  border-radius: 10px;
  padding: 30px;
  -webkit-box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
  box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
  margin-bottom: 30px;
}
</style>

