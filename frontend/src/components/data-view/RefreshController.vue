<template>
  <div class="d-flex justify-center">
    <p class="text-subtitle-2">
      Refreshing in {{ countdown }} seconds..
    </p>
    <v-icon class="clickable-icon" color="info" size="x-small" @click.prevent="handleRefresh">
      <i class="fa fa-refresh" aria-hidden="true" />
    </v-icon>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps({ refreshInterval: { type: Number, default: 0 } });
const emit = defineEmits(['refresh']);

const countdown = ref(props.refreshInterval);

const resetCountdown = () => {
  countdown.value = props.refreshInterval;
};

const handleRefresh = () => {
  resetCountdown();
  emit('refresh', true);
};

setInterval(() => {
  if (--countdown.value === 0) handleRefresh();
}, 1000);
</script>

<style scoped>
@import "@/assets/styles/icon.css";
</style>
