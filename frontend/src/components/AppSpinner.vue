<template>
  <div v-if="spinner" class="overlay-container">
    <!-- Overlay background -->
    <div class="overlay-bg" />

    <!-- Progress component -->
    <v-progress-circular
      class="overlay-item"
      color="secondary"
      indeterminate
      :size="128"
      :width="15"
    />
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'AppAlert',
  setup: () => {
    const store = useStore();

    return {
      spinner: computed(() => store.getters['global/spinner'])
    };
  }
};
</script>

<style scoped>
@import "@/assets/styles/overlay.css";
</style>
