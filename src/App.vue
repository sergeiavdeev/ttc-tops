<script setup>
import TopNav from '@/components/TopNav.vue'
import Footer from '@/components/FooterComponent.vue'
import { useUserStore } from '@/stores/user.js'
import { onMounted } from 'vue'

const user = useUserStore();

onMounted(() => {
  user.getUser();
})

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
