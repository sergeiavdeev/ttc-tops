<script setup>
import { computed, onMounted} from 'vue'
import storage from '@/api/storage.js'
import { useUserStore } from '@/stores/user.js'
import { useRouter } from 'vue-router'
import { useStorageStore } from '@/stores/storage.js'
import commons from '@/api/commons.js'
import { storeToRefs } from 'pinia'
import { useRulesStore } from '@/stores/rules.js'

const router = useRouter();
const userInfo = useUserStore();
const storageStore = useStorageStore();
const rulesStore = useRulesStore();

const { getWorkTimesByResourceId, getTimeList, existFreeTime, getMaxDuration } = storeToRefs(storageStore);

const props = defineProps(['resourceId'])
const durationText = computed(() => getDurationText(Number(duration.value)))
const orderDate = defineModel('orderDate',{ default: "" })
const orderTime = defineModel('orderTime', { default: ""})
const duration = defineModel('duration', {default: 1});
const amount = defineModel('amount', {default: 0.0});
const maxDate = (function () {
  let date = new Date()
  date.setDate(date.getDate() + 14);
  return commons.dateToString(date);
})();
const minDate = (function () {
  let date = new Date()
  return commons.dateToString(date);
})();

const isOrderValid = computed(() => {
  let bookingByDayOfWeek = rulesStore.getBookingByDayOfWeek(props.resourceId, userInfo.mainRole, new Date(orderDate.value).getDay());
  let bookingToday = rulesStore.getBookingToday(props.resourceId, userInfo.mainRole, orderDate.value);
  return (bookingByDayOfWeek || bookingToday) && orderTime.value !== "" && amount.value > 0;
})

onMounted(() => {
  let stringDate = commons.dateToString();
  orderDate.value = stringDate;
  loadSettings();
  storageStore.loadWorkTime(props.resourceId, stringDate);
  getAmount();
})

function changeDate() {
  storageStore.loadWorkTime(props.resourceId, orderDate.value);
  saveSettings();
}

function onChangeDuration() {
  getAmount();
  saveSettings();
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

function getAmount() {
  storage.getAmount(props.resourceId, duration.value)
    .then((res) => {
      let sum = parseFloat(res);
      if(isNaN(sum)) {
        sum = 0
      }
      amount.value = sum;
    });
}

function selectStartTime(time) {
  if (orderTime.value === time) {
    orderTime.value = "";
  } else {
    orderTime.value = time;
  }
  saveSettings();
}

function saveSettings() {
  localStorage.setItem(props.resourceId,
    JSON.stringify({
        orderTime: orderTime.value,
        duration: duration.value,
        orderDate: orderDate.value
      }
    )
  );
}

function loadSettings() {
  let settings = JSON.parse(localStorage.getItem(props.resourceId));
  if (settings) {
    orderDate.value = settings.orderDate;
    duration.value = settings.duration;
    orderTime.value = settings.orderTime;
  }
}

function keyDown(event) {
  event.preventDefault()
}

function order() {

  let startDate = commons.getDate(orderTime.value);
  let endDate = commons.getDate(orderTime.value);

  endDate.setMinutes(startDate.getMinutes() + duration.value * 60);

  storage.createOrder(props.resourceId, orderDate.value, orderTime.value, "9:00")
  //storage.createOrder(props.resourceId, orderDate.value, orderTime.value, commons.timeToString(endDate))
  .then((response) => {
    if (response.ok) {
      router.push('/orders');
    }
    else {
      if (response.status === 401) {
        userInfo.login();
      }
      if (response.status === 500) {
        response.text().then((text) => {
          alert(text);
        })
      }
      if (response.status === 400) {
        response.json().then((json) => {
          alert(JSON.stringify(json));
        })
      }
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
    <div class="interval" v-for="interval in getWorkTimesByResourceId(props.resourceId, orderDate)" v-bind:key="interval.startTime">
      {{ interval.startTime }} - {{ interval.endTime }}
    </div>
    <h3>{{existFreeTime(props.resourceId, orderDate) ? "Выбрать время" : "Нет свободного времени"}}</h3>
    <div class="free-time">
      <div class="free-time-el" v-for="el in getTimeList(props.resourceId, orderDate, duration)" :key="el"
           v-bind:class="orderTime === el ? 'selected' : ''"
           v-on:click="selectStartTime(el)">{{el}}</div>
    </div>
    <label for="hours" v-if="existFreeTime(props.resourceId, orderDate)">Количество часов</label>
    <input
      v-model="duration"
      type="range"
      name="hours"
      id="hours"
      min="1"
      :max="getMaxDuration(props.resourceId, orderDate, orderTime)"
      step="0.5"
      value="1"
      v-if="existFreeTime(props.resourceId, orderDate)"
      v-on:change="onChangeDuration"
    />
    <output v-if="existFreeTime(props.resourceId, orderDate)" class="price-output" for="hours">{{durationText}} - {{amount}} руб.</output>
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
  margin: 0.5rem;
}

input[type='date'],
input[type='time'] {
  font-size: 2rem;
  padding: 10px;
}

.interval {
  font-size: 2.2rem;
  padding: 5px;
}

.free-time {
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  padding: 10px;
}

.free-time-el {
  font-size: 1.5rem;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid var(--color-light);
  -webkit-box-shadow: 4px 4px 8px 0 rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 4px 4px 8px 0 rgba(34, 60, 80, 0.2);
  box-shadow: 4px 4px 8px 0 rgba(34, 60, 80, 0.2);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.selected {
  background-color: var(--color-light);
}

.free-time-el:hover {
  border-radius: 2px;
  border: 1px solid blue;
  -webkit-box-shadow: 5px 5px 9px 0 rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 5px 5px 9px 0 rgba(34, 60, 80, 0.2);
  box-shadow: 5px 5px 9px 0 rgba(34, 60, 80, 0.2);
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
