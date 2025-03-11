<script setup>

import { ref } from 'vue'
import CollapseLink from '@/components/links/CollapseLink.vue'
import LoadingView from '@/components/LoadingView.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'

const props = defineProps(['collapse'])

const changed = ref(false)
const loading = ref(false)
const isError = ref(false)
const error = ref({})
const collapsed = ref(props.collapse);

function remove() {

}

function add() {

}

</script>

<template>
  <div class="schedule-settings">
    <form action="" v-on:input="null" onsubmit="return false">
      <div class="form-group flex-column">
        <div class="form-group-header">
          <CollapseLink caption="Отклонения от графика" v-bind:collapsed="collapsed" @collapse="collapsed = !collapsed"/>
        </div>
        <div :class="collapsed ? 'hidden' : 'visible'">
          <div class="button-group">
            <button :disabled="loading" v-on:click="add">Создать</button>
            <button :disabled="!changed" v-on:click="remove">Удалить</button>
          </div>
        </div>
      </div>
    </form>
    <LoadingView v-if="loading" />
    <ErrorComponent v-if="isError" v-bind:error="error" @closeError="isError = false" />
  </div>
</template>

<style scoped>
.button-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
</style>
