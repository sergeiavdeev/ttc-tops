<script setup>
import TopNav from '@/components/TopNav.vue'
import Footer from '@/components/FooterComponent.vue'
import { useUserStore } from '@/stores/user.js'
import { onMounted } from 'vue'
import { useStorageStore } from '@/stores/storage.js'

const user = useUserStore();
const storage = useStorageStore();

onMounted(() => {
  user.getUser();
  storage.getInfo();
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
