<script setup>
import TopNav from '@/components/TopNav.vue'
import Footer from '@/components/FooterComponent.vue'
import { useUserStore } from '@/stores/user.js'
import { onBeforeMount, onMounted } from 'vue'
import { useStorageStore } from '@/stores/storage.js'
import * as rsocket from '@/api/rsocket.js'
import { encodeCompositeMetadata, encodeRoute, MESSAGE_RSOCKET_ROUTING } from 'rsocket-core'
import { useRouter } from 'vue-router'

const user = useUserStore();
const storage = useStorageStore();
const router = useRouter();

onBeforeMount(() => {
  user.getUser();
  storage.loadInfo();
})

onMounted(() => {

  rSocketStreamHandler();
  let lastRoute = localStorage.getItem('lastRoute');
  if (lastRoute && window.location.pathname === "/") {
    router.push(lastRoute);
  }
})

function rSocketStreamHandler() {
  return rsocket.connect()
    .then((socket) => {
      const stream = socket.requestStream({
        data: null,
        metadata: encodeCompositeMetadata([
          [MESSAGE_RSOCKET_ROUTING, encodeRoute('ttc-tops.stream')],
        ])
      });
      stream.subscribe({
        onNext(payload) {
          console.log("Receive event: " + JSON.stringify(payload));
          handleEvent(payload.data);
        },
        onError(e) {
          console.log("ErrorComponent: " + e);
        },
        onComplete() {
          console.log("Completed");
        },
        onSubscribe(s) {
          s.request(2147483642);
          console.log("Subscribe:" + s);
        },
      });
    });
}

function handleEvent(event) {

  if (event.type === "BookingCreated" || event.type === "BookingCanceled") {
    let resourceId = event.data.resourceId;
    let date = event.data.bookingDate;
    storage.updateWorkTime(resourceId, date);

    if (user.hasRole("admin") || user.hasRole("owner")) {
      storage.setDoUpdate({
        order: true,
        workTime: false,
      });
    }
    if (user.hasRole("user")) {
      storage.setDoUpdate({
        order: true,
        workTime: false,
      });
    }
  }
  if (event.type === "OrderPayed" && user.hasRole("user")) {
    storage.setDoUpdate({
      order: true,
      workTime: false,
    });
  }
  console.log("Event: " + event.type + " handled");
}

</script>

<template>
  <TopNav />
  <main>
    <RouterView />
  </main>
  <Footer />
</template>

<style scoped></style>
