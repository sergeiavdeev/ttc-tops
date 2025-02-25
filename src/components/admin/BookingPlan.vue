<script setup>
  import ContactLink from '@/components/links/ContactLink.vue'
  import { useOrdersStore } from '@/stores/orders.js'

  const props = defineProps(['resource'])
  const ordersStore = useOrdersStore();

  function deleteOrder(id) {
    ordersStore.deleteOrder(id);
  }

  function payOrder(id, sum) {
    ordersStore.payOrder(id, sum);
  }
</script>

<template>
  <div class="resource-plan">
    <!--
    <table>
      <caption>{{props.resource.name}}</caption>
      <thead>
        <tr>
          <th colspan="2">Время</th>
          <th>Имя</th>
          <th>E-mail</th>
          <th>К оплате</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody v-for="date in props.resource.dates" :key="date">
        <tr>
          <td class="center-col" colspan="7">{{new Date(date.date).toLocaleString().split(',')[0]}}</td>
        </tr>
        <tr v-for="booking in date.bookings" :key="booking.startTime">
          <td>{{booking.startTime}}</td>
          <td>{{booking.endTime}}</td>
          <td>{{booking.firstName}} {{booking.lastName}}</td>
          <td><a v-bind:href="'mailto:' + booking.email">{{booking.email}}</a></td>
          <td class="right">{{booking.debt}}</td>
          <td class="cell-actions"><ContactLink img="accept" v-on:click="payOrder(booking.id, booking.debt)" v-if="booking.debt > 0"/></td>
          <td class="cell-actions"><ContactLink img="cancel" v-on:click="deleteOrder(booking.id)"/></td>
        </tr>
      </tbody>
    </table>
    -->

    <h2>{{resource.name}}</h2>
    <div class="plan-grid">
      <div v-for="date in resource.dates" :key="date">
        <h3>{{date.date}}</h3>
        <div v-for="booking in date.bookings" :key="booking.startTime" class="booking-row">
          <div>{{booking.startTime}} - {{booking.endTime}}</div>
          <a v-bind:href="'mailto:' + booking.email">{{booking.firstName}} {{booking.lastName}}</a>
          <!--<div><a v-bind:href="'mailto:' + booking.email">{{booking.email}}</a></div>-->
          <div>{{booking.debt}}</div>
          <div class="grid-controls">
            <ContactLink img="accept" v-on:click="payOrder(booking.id, booking.debt)" v-if="booking.debt > 0"/>
            <ContactLink img="cancel" v-on:click="deleteOrder(booking.id)"/>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.resource-plan {
  max-width: 650px;
}
h3 {
  background-color: var(--color-light);
  color: white;
  padding: 10px 0 10px 0;
}

.booking-row {
  display: grid;
  grid-template-columns: 11rem 3fr 1fr 1fr;
  align-items: center;
  gap: 2rem;
  font-size: 1.8rem;
  padding: 10px 0 10px 0;
}

.plan-grid {
  display: grid;
  border-radius: 5px;
  border: 1px solid var(--color-light);
  -webkit-box-shadow: 4px 4px 8px 0 rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 4px 4px 8px 0 rgba(34, 60, 80, 0.2);
  box-shadow: 4px 4px 8px 0 rgba(34, 60, 80, 0.2);
}

.grid-controls {
  display: flex;
  flex-direction: row;
  justify-content: end;
  min-height: 24px;
  min-width: 96px;
}

.time-interval {
  min-width: 11rem;
}


.center-col {
  text-align: center;
  background-color: lightgrey;
  color: var(--color-dark);
}

.cell-actions {
  cursor: pointer;
}

.cell-actions:hover {
  background-color: var(--color-dark);
}

table {
  font-size: 1.8rem;
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid var(--color-light);
  -webkit-box-shadow: 4px 4px 8px 0 rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 4px 4px 8px 0 rgba(34, 60, 80, 0.2);
  box-shadow: 4px 4px 8px 0 rgba(34, 60, 80, 0.2);
}

th {
  text-align: center;
  border: 1px solid var(--color-dark);
  background-color: var(--color-dark);
  color: var(--color-white);
}

th, td {
  padding: 10px
}

td {
  text-align: left;
}

caption {
  font-size: 2.5rem;
  font-weight: 700;
}


a {
  color: var(--color-dark);
}

a:hover {
  color: var(--color-light);
}


</style>
