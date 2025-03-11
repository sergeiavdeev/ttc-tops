<script setup>
import { storeToRefs } from 'pinia'
import { useStorageStore } from '@/stores/storage.js'
import { onMounted, ref } from 'vue'
import LoadingView from '@/components/LoadingView.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
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

function getInputType(typeName) {
  let type = "";
  switch (typeName) {
    case "phone":
      type = "tel";
      break;
    case "e-mail":
      type = "email";
      break;
    default:
      type = "text";
      break;
  }
  return type;
}

function getInputLabel(typeName) {
  let label = "";
  switch (typeName) {
    case "phone":
      label = "Телефон";
      break;
    case "e-mail":
      label = "E-mail";
      break;
    default:
      label = "Неизвестно что";
      break;
  }
  return label;
}
</script>

<template>
  <div class="contacts-settings">
    <form action="" v-on:input="changeInfo" onsubmit="return false">
      <div class="form-group flex-column">
        <div class="form-group-header">
          <CollapseLink :caption="`Контакты (${info.contacts.length})`" v-bind:collapsed="collapsed" @collapse="collapsed = !collapsed"/>
        </div>
        <div :class="collapsed ? 'hidden' : 'visible'">
          <div class="contact" v-for="contact in info.contacts" :key="contact.id">
            <label :for="contact.id">{{getInputLabel(contact.type.name)}}</label>
            <input :type="getInputType(contact.type.name)" :placeholder="contact.type.name" :id="contact.id" v-model="contact.value" />
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
  .contacts-settings {
    width: 100%;
  }

  .contact {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }
</style>
