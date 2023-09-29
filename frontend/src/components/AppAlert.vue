<template>
  <div v-if="alertShown" class="overlay-container">
    <!-- Overlay background -->
    <div class="overlay-bg" />

    <!-- Alert component -->
    <v-alert
      v-model="alertShown"
      class="overlay-item"
      variant="tonal"
      border="top"
      :closable="true"
      :type="alertType"
      :title="alertTitle"
    >
      <p v-if="alertReason" class="text-body-1">
        {{ alertReason }}
      </p>

      <p class="text-subtitle-2">
        {{ alertMessage }}
      </p>
    </v-alert>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { HttpStatusCode } from 'axios';

const store = useStore();
const router = useRouter();

const alertShown = ref(false);
const alertType = ref(null);
const alertTitle = ref(null);
const alertMessage = ref(null);
const alertReason = ref(null);

const isTokenExpired = ({ status }) => (
  // Verify if the status code is "unauthorized" and the user is still logged in,
  // indicating that the token has expired and a new login is necessary.
  status === HttpStatusCode.Unauthorized && computed(() => store.getters['user/isLoggedIn'])
);
const isSuccessfulResponse = ({ status }) => status && status >= 200 && status < 300;

watch(
  computed(() => store.getters['global/alert']),
  (newAlert) => {
    // Verify if the token has expired; if it has, log the user out and redirect them to the home page.
    if (isTokenExpired(newAlert)) return router.push({ path: '/' });

    if (!newAlert?.status) { // Info
      alertType.value = 'info';
      alertTitle.value = 'Info';
      alertMessage.value = newAlert?.data?.message;
      alertReason.value = null;
    } else if (!isSuccessfulResponse(newAlert)) { // Error
      alertType.value = 'error';
      alertTitle.value = `Error (${newAlert?.status} - ${newAlert?.statusText})`;
      alertMessage.value = newAlert?.data?.error?.message ?? newAlert.data;
      alertReason.value = newAlert?.data?.error?.reason;
    } else { // Success
      alertType.value = 'success';
      alertTitle.value = `Success (${newAlert?.status} - ${newAlert?.statusText})`;
      alertMessage.value = newAlert?.data;
      alertReason.value = null;
    }

    alertShown.value = true;
  }
);
</script>

<style scoped>
@import "@/assets/styles/overlay.css";

.overlay-container .overlay-item p {
  margin: 1em;
}
</style>
