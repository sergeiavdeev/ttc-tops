<script setup>
import { computed, onMounted, ref } from 'vue'
import orderApi from '@/api/order.js'
import bookingApi from '@/api/booking.js'
import { useUserStore } from '@/stores/user.js'
import { useRouter } from 'vue-router'
import { useStorageStore } from '@/stores/storage.js'
import commons from '@/api/commons.js'
import { storeToRefs } from 'pinia'
import { useRulesStore } from '@/stores/rules.js'
import ErrorComponent from '@/components/ErrorComponent.vue'
import LoadingView from '@/components/LoadingView.vue'
import CollapseLink from '@/components/links/CollapseLink.vue'

const router = useRouter();
const userInfo = useUserStore();
const storageStore = useStorageStore();
const rulesStore = useRulesStore();

const { getWorkTimesByResourceId, getTimeList, existFreeTime, getMaxDuration, getResource } = storeToRefs(storageStore);

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

const loading = ref(false);
const isError = ref(false);
const error = ref({});
const collapsed = ref(false);

onMounted(() => {
  orderDate.value = commons.dateToString();
  loadSettings();
  storageStore.loadWorkTime(props.resourceId, orderDate.value);
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

async function getAmount() {
  let res = await orderApi.getAmount(props.resourceId, duration.value);
  if (!res.isError) {
    let data = res.data;
    let sum = data.sum;
    if (data.condition.sum) {
      sum = data.condition.sum;
    }
    amount.value = sum;
  } else {
    amount.value = 0;
  }
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
    let savingDate = new Date(settings.orderDate);
    if (savingDate > new Date()) {
      orderDate.value = settings.orderDate;
    }
    duration.value = settings.duration;
    orderTime.value = "";
  }
}

function keyDown(event) {
  event.preventDefault()
}

async function bookingCreate() {

  let startDate = commons.getDate(orderTime.value);
  let endDate = commons.getDate(orderTime.value);

  endDate.setMinutes(startDate.getMinutes() + duration.value * 60);

  loading.value = true;
  let result = await bookingApi.createBooking(props.resourceId, orderDate.value, orderTime.value, commons.timeToString(endDate));
  loading.value = false;
  isError.value = result.isError;
  if (result.isError) {
    error.value = result.data;
  } else {
    await router.push('/orders');
  }
}
</script>

<template>
  <div class="form-group flex-column flex-center">
    <div class="form-group-header">
      <CollapseLink :caption="`${getResource(props.resourceId).name} (${getResource(props.resourceId).description})`" v-bind:collapsed="collapsed" @collapse="collapsed = !collapsed"/>
    </div>
    <div :class="collapsed ? 'hidden' : 'visible'">
      <!--<h2>{{getResource(props.resourceId).name}} ({{getResource(props.resourceId).description}})</h2> -->
      <label for="rentDate"
        >Дата:
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
      <!--
      <div
        class="interval"
        v-for="interval in getWorkTimesByResourceId(props.resourceId, orderDate)"
        v-bind:key="interval.startTime"
      >
        {{ interval.startTime }} - {{ interval.endTime }}
      </div>
      -->
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
      <output v-if="existFreeTime(props.resourceId, orderDate)" class="price-output" for="hours">
        {{ durationText }} - {{ amount }} руб.
      </output>
      <h3>
        {{ existFreeTime(props.resourceId, orderDate) ? 'Выбрать время' : 'Нет свободного времени' }}
      </h3>
      <div class="free-time">
        <div
          class="free-time-el"
          v-for="el in getTimeList(props.resourceId, orderDate, duration)"
          :key="el"
          v-bind:class="orderTime === el ? 'selected' : ''"
          v-on:click="selectStartTime(el)"
        >
          {{ el }}
        </div>
      </div>
      <button v-on:click="bookingCreate" :disabled="loading || !isOrderValid">Забронировать</button>
    </div>
    <LoadingView v-if="loading"/>
    <ErrorComponent v-if="isError" v-bind:error="error" @closeError="isError=false"/>
  </div>
</template>

<style scoped>

h3 {
  color: var(--color-light);
}

.flex-center {
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

label {
  font-size: 2rem;
  cursor: default;
}

input[type='date'],
input[type='time'] {
  width: auto;
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

.price-output {
  font-size: 1.5rem;
}

</style>
