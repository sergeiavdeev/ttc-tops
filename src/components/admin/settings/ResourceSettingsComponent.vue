<script setup>

import LoadingView from '@/components/LoadingView.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import { storeToRefs } from 'pinia'
import { useStorageStore } from '@/stores/storage.js'
import { onMounted, ref } from 'vue'
import CollapseLink from '@/components/links/CollapseLink.vue'

const props = defineProps(['collapse'])
const { info, getContacts, getResources } = storeToRefs(useStorageStore())
const changed = ref(false)
const loading = ref(false)
const isError = ref(false)
const error = ref({})
const collapsed = ref(props.collapse);
let infoBeforeChange = {}

onMounted(() => {
  infoBeforeChange = Object.assign(infoBeforeChange, info.value);
  infoBeforeChange.contacts = JSON.parse(JSON.stringify(getContacts.value));
  infoBeforeChange.resources = JSON.parse(JSON.stringify(getResources.value));
})

function changeInfo() {

  changed.value =
    infoBeforeChange.name !== info.value.name ||
    infoBeforeChange.address !== info.value.address ||
    infoBeforeChange.lat !== info.value.lat ||
    infoBeforeChange.lng !== info.value.lng ||
    infoBeforeChange.description !== info.value.description ||
    JSON.stringify(infoBeforeChange.contacts) !== JSON.stringify(info.value.contacts) ||
    JSON.stringify(infoBeforeChange.resources) !== JSON.stringify(info.value.resources);
}
</script>

<template>
  <div class="resource-settings">
    <form action="" v-on:input="changeInfo" onsubmit="return false">
      <div class="form-group flex-column" >
        <div class="form-group-header">
          <CollapseLink :caption="`Ресурсы (${info.resources.length})`" v-bind:collapsed="collapsed" @collapse="collapsed = !collapsed"/>
        </div>
        <div :class="collapsed ? 'hidden' : 'visible'">
          <div class="form-group flex-column" v-for="resource in info.resources" :key="resource.id">
            <label :for="resource.id + '-name'">Наименование</label>
            <input type="text" placeholder="Наименование" :id="resource.id + '-name'" v-model="resource.name" />
            <label :for="resource.id + '-descr'">Описание</label>
            <input type="text" placeholder="Описание" :id="resource.id + '-descr'" v-model="resource.description" />
          </div>
          <button :disabled="!changed" v-on:click="save">Сохранить</button>
        </div>
      </div>
    </form>
    <LoadingView v-if="loading" />
    <ErrorComponent v-if="isError" v-bind:error="error" @closeError="isError = false" />
  </div>
</template>

<style scoped>
 .resource-settings {
   width: 100%;

 }
</style>
