<script setup>
  import StorageSettingsComponent from '@/components/admin/settings/StorageSettingsComponent.vue'
  import ContactsSettingsComponent from '@/components/admin/settings/ContactsSettingsComponent.vue'
  import ResourceSettingsComponent from '@/components/admin/settings/ResourceSettingsComponent.vue'
  import ScheduleSettingsComponent from '@/components/admin/settings/ScheduleSettingsComponent.vue'
  import DeviationsSettingsComponent from '@/components/admin/settings/DeviationsSettingsComponent.vue'
  import { useStorageStore } from '@/stores/storage.js'
  import { storeToRefs } from 'pinia'

  const { getCalendars } = storeToRefs(useStorageStore());
</script>

<template>
  <div class="container">
    <div class="settings">
      <StorageSettingsComponent :collapse="false"/>
      <div>
        <ContactsSettingsComponent :collapse="true"/>
        <ResourceSettingsComponent :collapse="true"/>
        <ScheduleSettingsComponent :collapse="false"/>
        <DeviationsSettingsComponent :collapse="true" v-if="getCalendars.length > 0" :calendar="getCalendars[0].id"/>
      </div>

    </div>
  </div>
</template>

<style scoped>

.settings {
  margin-top: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  width: 100%;
}

@media (max-width: 740px) {
  .settings {
    grid-template-columns: 1fr;
    gap: 0;
  }
}

</style>
