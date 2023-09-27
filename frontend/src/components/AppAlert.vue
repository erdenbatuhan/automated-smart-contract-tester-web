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

<script>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'AppAlert',
  setup: () => {
    const store = useStore();

    const alertShown = ref(false);
    const alertType = ref(null);
    const alertTitle = ref(null);
    const alertMessage = ref(null);
    const alertReason = ref(null);

    watch(
      computed(() => store.getters['global/alert']),
      (newAlert) => {
        if (!newAlert.status) { // Info
          alertType.value = "info";
          alertTitle.value = "Info";
          alertMessage.value = newAlert.data.message;
          alertReason.value = null;
        } else if (newAlert.data.error) { // Error
          alertType.value = "error";
          alertTitle.value = `Error (${newAlert.status} - ${newAlert.statusText})`;
          alertMessage.value = newAlert.data.error.message;
          alertReason.value = newAlert.data.error.reason;
        } else { // Success
          alertType.value = "success";
          alertTitle.value = `Success (${newAlert.status} - ${newAlert.statusText})`;
          alertMessage.value = newAlert.data.message;
          alertReason.value = null;
        }

        alertShown.value = true;
      }
    );

    return {
      alertShown,
      alertType,
      alertTitle,
      alertMessage,
      alertReason
    };
  }
};
</script>

<style scoped>
@import "@/assets/styles/overlay.css";

.overlay-container .overlay-item p {
  margin: 1em;
}
</style>
