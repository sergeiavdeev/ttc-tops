<script setup>

import IconExpand from '@/components/icons/IconExpand.vue'
import IconCollapse from '@/components/icons/IconCollapse.vue'

defineProps(['caption', 'collapsed']);
defineEmits(['collapse']);

</script>

<template>
  <div class="collapse-link" v-on:click="$emit('collapse')">
    {{caption}}
    <IconExpand v-if="collapsed"/>
    <IconCollapse v-if="!collapsed"/>
  </div>
</template>

<style scoped>
  .collapse-link {
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
  }
</style>
