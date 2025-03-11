<script setup>
import { storeToRefs } from 'pinia'
import { useStorageStore } from '@/stores/storage.js'
import { onMounted, ref } from 'vue'
import LoadingView from '@/components/LoadingView.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import storageApi from '@/api/storage.js'
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

async function save() {
  loading.value = true
  let request = {
    id: info.value.id,
    name: info.value.name,
    owner: info.value.owner,
    address: info.value.address,
    lat: info.value.lat,
    lng: info.value.lng,
    description: info.value.description,
    resources: info.value.resources,
    contacts: info.value.contacts
  }

  let result = await storageApi.updateInfo(request)
  loading.value = false
  isError.value = result.isError
  if (result.isError) {
    error.value = result.data
  } else {
    infoBeforeChange = Object.assign(infoBeforeChange, info.value)
  }
}


</script>

<template>
  <div class="storage-settings">
    <form action="" v-on:input="changeInfo" onsubmit="return false">
      <div class="form-group flex-column">
        <div class="form-group-header">
          <CollapseLink caption="Общие" v-bind:collapsed="collapsed" @collapse="collapsed = ! collapsed"/>
        </div>
        <div :class="collapsed ? 'hidden' : 'visible'">
          <label for="name">Наименование</label>
          <input type="text" placeholder="Наименование" id="name" v-model="info.name" />
          <label for="address">Адрес</label>
          <input type="text" placeholder="Адрес" id="address" v-model="info.address" />
          <label for="lat">Широта</label>
          <input type="text" placeholder="Широта" id="lat" v-model.number="info.lat" />
          <label for="lng">Долгота</label>
          <input type="text" placeholder="Долгота" id="lng" v-model.number="info.lng" />
          <label for="description">Как пройти</label>
          <input type="text" placeholder="Как пройти" id="description" v-model="info.description" />
          <button :disabled="!changed" v-on:click="save">Сохранить</button>
        </div>
      </div>
    </form>
    <LoadingView v-if="loading" />
    <ErrorComponent v-if="isError" v-bind:error="error" @closeError="isError = false" />
  </div>
</template>

<style scoped>
  .storage-settings {
    width: 100%;
  }


</style>
