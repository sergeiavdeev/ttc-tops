<script setup>

import { storeToRefs } from 'pinia'
import { useStorageStore } from '@/stores/storage.js'
import { ref } from 'vue'
import LoadingView from '@/components/LoadingView.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import CollapseLink from '@/components/links/CollapseLink.vue'
import commons from '../../../api/commons.js'
import IconSchedule from '@/components/icons/IconSchedule.vue'

const props = defineProps(['collapse'])
const { getCalendars } = storeToRefs(useStorageStore())
const changed = ref(false)
const loading = ref(false)
const isError = ref(false)
const error = ref({})
const collapsed = ref(props.collapse);

function addCalendar() {

}

function save() {

}
</script>

<template>
  <div class="schedule-settings">
    <form action="" v-on:input="null" onsubmit="return false">
      <div class="form-group flex-column">
        <div class="form-group-header">
          <CollapseLink :caption="`Графики работы (${getCalendars.length})`" v-bind:collapsed="collapsed" @collapse="collapsed = !collapsed"/>
        </div>
        <div :class="collapsed ? 'hidden' : 'visible'">
          <div class="calendar" v-for="calendar in getCalendars" :key="calendar.id">
            <label :for="calendar.id + 'date'">Действует с</label>
            <input type="date" placeholder="Наименование" :id="calendar.id + 'date'" v-model="calendar.startDate" disabled/>
            <label :for="calendar.id + 'name'">Описание</label>
            <input type="text" placeholder="Адрес" :id="calendar.id + 'name'" v-model="calendar.name" />
            <div class="schedules">
              <div v-for="schedule in calendar.schedules" :key="schedule.dayOfWeek">
                <div class="schedule-day">{{commons.dayOfWeek(schedule.dayOfWeek)}}</div>
                <ul>
                  <li v-for="interval in schedule.timeIntervals" :key="interval.startTime">
                    <IconSchedule />{{interval.startTime}} - {{interval.endTime}}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="button-group">
            <button :disabled="!changed" v-on:click="save">Сохранить</button>
            <button :disabled="loading" v-on:click="addCalendar">Создать</button>
          </div>
        </div>
      </div>
    </form>
    <LoadingView v-if="loading" />
    <ErrorComponent v-if="isError" v-bind:error="error" @closeError="isError = false" />
  </div>
</template>

<style scoped>
.schedule-settings {
  width: 100%;
}

.calendar {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.button-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.schedule-day {
  font-size: 2rem;
  padding: 1rem 0 0 0;
  border-bottom: 1px solid var(--color-light);
}

.schedules {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-items: center;
}

li {
  font-size: 2rem;
  display: flex;
  align-items: center;
  padding: 1rem 0 0 0;
}
</style>
