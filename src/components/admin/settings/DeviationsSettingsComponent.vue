<script setup>

import { onMounted, ref } from 'vue'
import CollapseLink from '@/components/links/CollapseLink.vue'
import LoadingView from '@/components/LoadingView.vue'
import ErrorComponent from '@/components/ErrorComponent.vue'
import { storeToRefs } from 'pinia'
import { useStorageStore } from '@/stores/storage.js'
import commons from '@/api/commons.js'
import IconSchedule from '@/components/icons/IconSchedule.vue'
import ContactLink from '@/components/links/ContactLink.vue'
import storageApi from '@/api/storage.js'

const props = defineProps(['collapse', 'calendar'])
const storage = useStorageStore();
const { getDeviations, getCalendars } = storeToRefs(storage)
const loading = ref(false)
const isError = ref(false)
const error = ref({})
const isNew = ref(false);
const collapsed = ref(props.collapse);
const freeDay = ref(true);
const selected = ref("");
const calendarId = ref(null);

const newDeviation = ref({date: "", timeIntervals: [{startTime: "00:00", endTime: "00:00"}]})

onMounted(() => {
  calendarId.value = props.calendar;
});

async function remove() {
  if (selected.value === "") return;
  loading.value = true;
  let res = await storageApi.deleteDeviation(calendarId.value, selected.value);
  loading.value = false;
  isError.value = res.isError;
  if (res.isError) {
    error.value = res.data;
  } else {
    storage.deleteDeviation(calendarId.value, selected.value);
    selected.value = "";
  }
}

function add() {
  isNew.value = true;
}

function cancel() {
  isNew.value = false;
}

async function save() {
  loading.value = true;
  let res = await storageApi.saveDeviation(calendarId.value, newDeviation.value);
  loading.value = false;
  isError.value = res.isError;
  if (res.isError) {
    error.value = res.data;
  } else {
    storage.addDeviation(res.data);
    isNew.value = false;
  }
}

function deleteInterval(index) {
  newDeviation.value.timeIntervals.splice(index, 1);
  if (newDeviation.value.timeIntervals.length === 0) {
    freeDay.value = true;
    freeDayChange();
  }
}

function freeDayChange() {
  if (freeDay.value) {
    newDeviation.value.timeIntervals = [{startTime: "00:00", endTime: "00:00"}];
  } else {
    newDeviation.value.timeIntervals = [{startTime: '10:00', endTime: '22:00'}];
  }
}

function select(date) {
  if (selected.value === date) {
    selected.value = "";
  } else {
    selected.value = date;
  }
}

</script>

<template>
  <div class="schedule-settings">
    <form action="" v-on:input="null" onsubmit="return false">
      <div class="form-group flex-column">
        <div class="form-group-header">
          <CollapseLink :caption="`Отклонения от графика (${getDeviations(calendarId).length})`" v-bind:collapsed="collapsed" @collapse="collapsed = !collapsed"/>
        </div>
        <div :class="collapsed ? 'hidden' : 'visible'">
          <label for="calendar-select">График</label>
          <select name="calendar-select" id="calendar-select" v-model="calendarId">
            <option v-for="(calendar) in getCalendars" :key="calendar.id" :value="calendar.id">{{calendar.name}}</option>
          </select>
          <div class="schedules" v-if="!isNew">
            <div v-for="deviation in getDeviations(calendarId)" :key="deviation.date" :class="selected === deviation.date ? 'schedule selected' : 'schedule'" v-on:click="select(deviation.date)">
              <div class="deviation-date">{{commons.formatDate(deviation.date)}}</div>
              <ul>
                <li v-for="interval in deviation.timeIntervals" :key="interval.startTime">
                  <IconSchedule />
                  <div v-if="interval.startTime !== interval.endTime">{{interval.startTime}} - {{interval.endTime}}</div>
                  <div v-if="interval.startTime === interval.endTime">Выходной</div>
                </li>
              </ul>
            </div>
          </div>
          <div class="schedules-add" v-if="isNew">
            <div class="schedules-add-date">
              <label for="new-deviation-date">Дата
                <input type="date" placeholder="Дата" id="new-deviation-date" v-model="newDeviation.date" />
              </label>
              <label for="free-day" class="checkbox">Выходной
                <input type="checkbox" id="free-day" v-model="freeDay" v-on:change="freeDayChange"/>
              </label>
            </div>
            <div v-if="!freeDay">
              <div v-for="interval in newDeviation.timeIntervals" :key="newDeviation.timeIntervals.indexOf(interval)" class="new-interval">
                <input type="time" placeholder="Время с" id="startTime" v-model="interval.startTime" />
                <input type="time" placeholder="Время по" id="endTime" v-model="interval.endTime" />
                <ContactLink img="cancel" v-on:click="deleteInterval(newDeviation.timeIntervals.indexOf(interval))" class="cancel-btn"/>
              </div>
            </div>
            <button :disabled="loading" v-on:click="newDeviation.timeIntervals.push({startTime: '10:00', endTime: '22:00'})" v-if="isNew && !freeDay">Добавить интервал</button>
          </div>
          <div class="button-group">
            <button :disabled="loading" v-on:click="add" v-if="!isNew">Добавить</button>
            <button :disabled="selected === ''" v-on:click="remove" v-if="!isNew">Удалить</button>
            <button :disabled="loading || newDeviation.date === ''" v-on:click="save" v-if="isNew">Сохранить</button>
            <button :disabled="loading" v-on:click="cancel" v-if="isNew">Отмена</button>
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

.selected {
  border: solid 1px blue;
}

.schedules {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  justify-items: left;
}

.schedule {
  cursor: pointer;
}

.schedules-add {
  display: flex;
  flex-direction: column;
}

.schedules-add-date {
  display: grid;
  grid-template-columns: 2fr 1fr;
  align-items: center;
  gap: 2rem;
}

.checkbox {
  color: black;
  font-size: 2rem;
  justify-self: end;

  input[type=checkbox] {
    transform: scale(1.5);
  }
}

.new-interval {
  display: grid;
  grid-template-columns: 4fr 4fr 1fr;
  gap: 2rem;
  justify-items: center;
}

.cancel-btn {
  justify-self: end;
}

.deviation-date {
  font-size: 2rem;
  padding: 1rem 0 0 0;
  border-bottom: 1px solid var(--color-light);
}

li {
  font-size: 2rem;
  display: flex;
  align-items: center;
  padding: 1rem 0 0 0;
}
</style>
