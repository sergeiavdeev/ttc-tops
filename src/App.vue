<script setup>
import TopNav from '@/components/TopNav.vue'
import Footer from '@/components/FooterComponent.vue'
import { useUserStore } from '@/stores/user.js'
import { onMounted} from 'vue'
import { useStorageStore } from '@/stores/storage.js'
import * as rsocket from '@/api/rsocket.js'
import { encodeCompositeMetadata, encodeRoute, MESSAGE_RSOCKET_ROUTING } from 'rsocket-core'
import { useRouter } from 'vue-router'
import { useOrdersStore } from '@/stores/orders.js'

const user = useUserStore();
const storage = useStorageStore();
const orderStore = useOrdersStore();
const router = useRouter();

onMounted(() => {
  user.getUser();
  storage.getInfo();
  rSocketStreamHandler();

  let lastRoute = localStorage.getItem('lastRoute');
  if (lastRoute) {
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
          console.log("Error: " + e);
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
      orderStore.loadOrdersAdmin();
    }
    if (user.hasRole("user")) {
      orderStore.loadOrders();
    }
  }
  if (event.type === "OrderPayed" && user.hasRole("user")) {
    orderStore.loadOrders();
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
