<template>
  <v-container v-if="alertShown" class="alert-container">
    <!-- Overlay background -->
    <div class="alert-overlay" />

    <!-- Alert component -->
    <v-alert
      v-model="alertShown"
      class="alert"
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
  </v-container>
</template>

<script>
import { ref, watch } from 'vue';
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
      () => store.getters['global/alert'],
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
.alert-container {
  position: relative;
}

.alert-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  backdrop-filter: blur(5px);
}

.alert {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  max-width: 80%;
}

.alert p {
  margin: 1em;
}
</style>
