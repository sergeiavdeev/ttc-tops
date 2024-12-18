<script setup>
  const props = defineProps(['resource'])
</script>

<template>
  <div class="resource-plan">
    <h2>{{props.resource.name}}</h2>
    <table v-for="date in props.resource.dates" :key="date">
      <tr>
        <th colspan="3">{{new Date(date.date).toLocaleString().split(',')[0]}}</th>
      </tr>
      <tr v-for="booking in date.bookings" :key="booking.startTime">
        <td class="td-time">{{booking.startTime}} - {{booking.endTime}}</td>
        <td class="td-name">{{booking.firstName}} {{booking.lastName}}</td>
        <td class="td-mail"><a v-bind:href="'mailto:' + booking.email">{{booking.email}}</a></td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
.resource-plan {
  max-width: 600px;
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
  border: 1px solid var(--color-light);
}

th, td {
  padding: 5px
}

td {
  text-align: left;
}

.td-time {
  width: 13rem;
}

.td-mail {
  width: 25rem;
}

a {
  color: var(--color-dark);
}

a:hover {
  color: var(--color-light);
}
</style>
