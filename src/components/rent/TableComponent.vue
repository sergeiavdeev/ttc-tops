<script setup>
import { computed, onMounted, ref, useId } from 'vue'
import storage from '@/api/storage.js'
import { useUserStore } from '@/stores/user.js'
const listId = useId();
const userInfo = useUserStore()
const props = defineProps(['resourceId'])
const workTime = ref([])
const timeList = ref([])
const isOrderValid = computed(() => orderTime.value !== "--:--");
const durationText = computed(() => getDurationText(Number(duration.value)))
const maxDuration = computed(() => getMaxDuration(orderTime.value, workTime.value));
const orderDate = defineModel('orderDate',{ default: new Date().toISOString().split('T')[0] })
const orderTime = defineModel('orderTime', { default: ""})
const duration = defineModel('duration', {default: 1});
const maxDate = (function () {
  let date = new Date()
  date.setDate(date.getDate() + 6)
  return date.toISOString().split('T')[0]
})()
const minDate = (function () {
  let date = new Date()
  return date.toISOString().split('T')[0]
})()

onMounted(() => {
  getWorkTime()
})

function changeDate() {
  getWorkTime()
}

function changeTime() {
  duration.value = 1;
}

function getDurationText(duration) {
  let text = "";
  switch (duration) {
    case 1:
      text = "1 час";
      break;
    case 1.5:
      text = "1.5 часа";
      break;
    case 2:
      text = "2 часа";
      break;
    default:
      break;
  }
  return text;
}

function getMaxDuration(orderTime, workTime) {
  let duration = 2;
  let startTimeMinutes = orderTime.split(":")[0] * 60 + Number(orderTime.split(":")[1]);
  for (let i = 0; i < workTime.length; i++) {
    let endTimeMinutes = workTime[i].endTime.split(":")[0] * 60 + Number(workTime[i].endTime.split(":")[1]);
    if(endTimeMinutes - startTimeMinutes > 0 && endTimeMinutes - startTimeMinutes < 120) {
      duration = (endTimeMinutes - startTimeMinutes) / 60;
      break;
    }
  }
  return duration;
}

function getWorkTime() {
  storage.getWorkTime(props.resourceId, orderDate.value)
    .then((res) => {
      if (res.dateWorkTimeList.length > 0) {
        workTime.value = res.dateWorkTimeList[0].timeIntervals
        generateTimeList(res.dateWorkTimeList[0].timeIntervals)
      }
  })
}

function generateTimeList(intervals) {
  let list = []
  for (let i = 0; i < intervals.length; i++) {
    let startTime = getDate(intervals[i].startTime)
    let endTime = getDate(intervals[i].endTime)
    endTime.setHours(endTime.getHours() - 1)
    list.push(intervals[i].startTime)
    while (startTime < endTime) {
      if (startTime.getMinutes() === 0) {
        startTime.setMinutes(startTime.getMinutes() + 30)
        //startTime = new Date(startTime);
      } else {
        startTime.setHours(startTime.getHours() + 1)
        startTime.setMinutes(0)
      }
      list.push((startTime.getHours() < 10 ? "0" + startTime.getHours() : startTime.getHours()) + ':' +
        (startTime.getMinutes() === 0 ? "00" : startTime.getMinutes())
      )
    }
  }
  timeList.value = list
}

function getDate(time) {
  let date = new Date()
  date.setHours(time.split(':')[0])
  date.setMinutes(time.split(':')[1])
  return date
}

function keyDown(event) {
  event.preventDefault()
}

function order() {

  let startDate = getDate(orderTime.value);
  let endDate = getDate(orderTime.value);

  endDate.setMinutes(startDate.getMinutes() + duration.value * 60);

  storage.createOrder(props.resourceId, orderDate.value, orderTime.value, endDate.toLocaleTimeString().substring(0, 5))
  .then((response) => {
    if (response.ok) {
      console.log(response);
      getWorkTime();
      alert("Бронирование успешно!")
    }
    if (response.status === 401) {
      userInfo.login();
    }
  })
    .catch((error) => {
      alert(error);
    });

  orderTime.value = "";
}
</script>

<template>
  <div class="table-container">
    <label for="rentDate"
      >Свободное время на:
      <input
        v-model="orderDate"
        type="date"
        id="rentDate"
        value="2024-01-01"
        :min="minDate"
        :max="maxDate"
        v-on:change="changeDate"
        v-on:keydown="keyDown"
      />
    </label>
    <div class="interval" v-for="interval in workTime" v-bind:key="interval.startTime">
      {{ interval.startTime }} - {{ interval.endTime }}
    </div>
    <label for="orderTime">
      Выбрать время
      <input
        v-model="orderTime"
        type="time"
        id="orderTime"
        step="1800"
        min="9-00"
        max="19-00"
        v-bind:list="listId"
        v-on:change="changeTime"
        v-on:keydown="keyDown"
      />
      <datalist v-bind:id="listId">
        <option v-for="el in timeList" v-bind:key="el" v-bind:value="el" />
      </datalist>
    </label>
    <label for="hours">Количество часов</label>
    <input
      v-model="duration"
      type="range"
      name="hours"
      id="hours"
      min="1"
      :max="maxDuration"
      step="0.5"
      value="1"
    />
    <output class="price-output" for="hours">{{durationText}}</output>
    <button v-on:click="order" v-if="isOrderValid">Забронировать</button>
  </div>
</template>

<style scoped>
.table-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

label {
  font-size: 2rem;
  cursor: default;
  margin: 0.7rem;
}

input[type='date'],
input[type='time'] {
  font-size: 2rem;
  padding: 10px;
}

.interval {
  font-size: 2.2rem;
  padding: 10px;
}

button {
  font-size: 2rem;
  padding: 15px;
  border-radius: 5px;
  background-color: var(--color-light);
  color: var(--color-white);
  transition: color 0.3s ease-in-out;
  margin-top: 3rem;
}

button:hover {
  color: white;
}
</style>
