<script setup>

import { storeToRefs } from 'pinia'
import { useStorageStore } from '@/stores/storage.js'
import { onMounted, ref } from 'vue'
import LoadingView from '@/components/LoadingView.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import CollapseLink from '@/components/links/CollapseLink.vue'
import commons from '../../../api/commons.js'
import IconSchedule from '@/components/icons/IconSchedule.vue'
import ContactLink from '@/components/links/ContactLink.vue'
import storegeApi from '@/api/storage.js'

const props = defineProps(['collapse'])
const { getCalendars, getResources, getInfo } = storeToRefs(useStorageStore())
const changed = ref(false)
const loading = ref(false)
const isError = ref(false)
const error = ref({})
const collapsed = ref(props.collapse);
const isNew = ref(false);
const isFormValid = ref(false);
const newSchedule = ref({
  ownerId: "",
  name: "",
  startDate: commons.dateToString(),
  schedules: [
    {
      dayOfWeek: 1,
      timeIntervals: [
        {
          startTime: "10:00",
          endTime: "22:00",
        }
      ]
    },
    {
      dayOfWeek: 2,
      timeIntervals: [
        {
          startTime: "10:00",
          endTime: "22:00",
        }
      ]
    },
    {
      dayOfWeek: 3,
      timeIntervals: [
        {
          startTime: "10:00",
          endTime: "22:00",
        }
      ]
    },
    {
      dayOfWeek: 4,
      timeIntervals: [
        {
          startTime: "10:00",
          endTime: "22:00",
        }
      ]
    },
    {
      dayOfWeek: 5,
      timeIntervals: [
        {
          startTime: "10:00",
          endTime: "22:00",
        }
      ]
    },
    {
      dayOfWeek: 6,
      timeIntervals: [
        {
          startTime: "10:00",
          endTime: "22:00",
        }
      ]
    },
    {
      dayOfWeek: 7,
      timeIntervals: [
        {
          startTime: "10:00",
          endTime: "22:00",
        }
      ]
    }
  ]});

let beforeChange = {};

onMounted(() => {
  beforeChange = {...{}, ...getCalendars.value[0]}
})

function addCalendar() {
  isNew.value = true;
}

async function save() {
  loading.value = true;
  let res = await storegeApi.addCalendar(newSchedule.value);
  loading.value = false;
  isError.value = res.isError;
  if (res.isError) {
    error.value = res.data;
  } else {
    isNew.value = false;
  }
}

function update() {

}

function validate() {
  if (!isNew.value) {
    changed.value = beforeChange.name !== getCalendars.value[0].name;
    return;
  }
  isFormValid.value = newSchedule.value.date !== ""
    && newSchedule.value.name !== ""
    && newSchedule.value.owner !== ""
    && checkIntervals();
}

function checkIntervals() {

  for (const schedule of newSchedule.value.schedules) {
      for (const interval of schedule.timeIntervals) {
        if (interval.startTime > interval.endTime) {
          return false;
        }
      }
  }
  return true;
}
</script>

<template>
  <div class="schedule-settings">
    <form action="" v-on:input="validate()" onsubmit="return false">
      <div class="form-group flex-column">
        <div class="form-group-header">
          <CollapseLink
            :caption="`Графики работы (${getCalendars.length})`"
            v-bind:collapsed="collapsed"
            @collapse="collapsed = !collapsed"
          />
        </div>
        <div :class="collapsed ? 'hidden' : 'visible'">
          <div v-if="!isNew">
            <div class="calendar" v-for="calendar in getCalendars" :key="calendar.id">
              <label :for="calendar.id + 'date'">Действует с</label>
              <input
                type="date"
                placeholder="Действует с"
                :id="calendar.id + 'date'"
                v-model="calendar.startDate"
                disabled
              />
              <label :for="calendar.id + 'name'">Описание</label>
              <input
                type="text"
                placeholder="Описание"
                :id="calendar.id + 'name'"
                v-model="calendar.name"
              />
              <div class="schedules">
                <div v-for="schedule in calendar.schedules" :key="schedule.dayOfWeek">
                  <div class="schedule-day">{{ commons.dayOfWeek(schedule.dayOfWeek) }}</div>
                  <ul>
                    <li v-for="interval in schedule.timeIntervals" :key="interval.startTime">
                      <IconSchedule />{{ interval.startTime }} - {{ interval.endTime }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div v-if="isNew">
            <div class="calendar">
              <label for="new-calendar-date">Действует с:</label>
              <input
                type="date"
                placeholder="Действует с:"
                id="new-calendar-date"
                v-model="newSchedule.startDate"
              />
              <label for="new-calendar-name">Описание:</label>
              <input
                type="text"
                placeholder="Описание"
                id="new-calendar-name"
                v-model="newSchedule.name"
              />
              <label for="new-calendar-owner">Владелец</label>
              <select id="new-calendar-owner" v-model="newSchedule.ownerId" v-on:change="validate">
                <option :value="getInfo.id">{{ getInfo.name }}</option>
                <option v-for="resource in getResources" :value="resource.id" :key="resource.id">
                  {{ resource.name }}
                </option>
              </select>
              <div class="schedules-new">
                <div v-for="schedule in newSchedule.schedules" :key="schedule.dayOfWeek">
                  <div class="schedule-day">
                    {{ commons.dayOfWeek(schedule.dayOfWeek) }}
                    <ContactLink
                      img="add"
                      v-on:click="
                        schedule.timeIntervals.push({ startTime: '10:00', endTime: '22:00' })
                      "
                    />
                  </div>
                  <div
                    v-for="interval in schedule.timeIntervals"
                    :key="schedule.timeIntervals.indexOf(interval)"
                    class="new-interval"
                  >
                    <input
                      type="time"
                      placeholder="Время с"
                      id="startTime"
                      v-model="interval.startTime"
                    />
                    <input
                      type="time"
                      placeholder="Время по"
                      id="endTime"
                      v-model="interval.endTime"
                    />
                    <ContactLink
                      img="cancel"
                      v-on:click="schedule.timeIntervals.splice(interval, 1)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="button-group">
            <button :disabled="!isFormValid" v-if="isNew" v-on:click="save">Сохранить</button>
            <button :disabled="!changed" v-if="!isNew" v-on:click="update">Сохранить</button>
            <button :disabled="loading" v-if="!isNew" v-on:click="addCalendar">Создать</button>
            <button :disabled="loading" v-if="isNew" v-on:click="isNew = false">Отмена</button>
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
  display: flex;
  flex-direction: row;
  align-items: center;
}

.schedules {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.schedules-new {
  display: flex;
  flex-direction: column;
}

.new-interval {
  display: grid;
  grid-template-columns: 4fr 4fr 1fr;
  gap: 2rem;
  justify-items: center;
}

li {
  font-size: 2rem;
  display: flex;
  align-items: center;
  padding: 1rem 0 0 0;
}
</style>
