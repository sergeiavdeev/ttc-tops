<script setup>
import TopNav from '@/components/TopNav.vue'
import Footer from '@/components/FooterComponent.vue'
</script>

<template>
  <TopNav />
  <main>
    <RouterView />
  </main>
  <Footer />
</template>

<style scoped>

</style>
