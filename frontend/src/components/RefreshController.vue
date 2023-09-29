<template>
  <div class="d-flex justify-center">
    <p class="text-subtitle-2">
      Refreshing in {{ countdown }} seconds..
    </p>
    <v-icon color="info" size="x-small" @click.prevent="handleRefresh">
      <i class="fa fa-refresh" aria-hidden="true" />
    </v-icon>
  </div>
</template>

<script setup>
import { defineProps, ref } from 'vue';

const props = defineProps({
  refreshInterval: { type: Number, default: 0 }
});

const countdown = ref(props.refreshInterval);
const emit = defineEmits(['refresh']);

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
.fa.fa-refresh {
  cursor: pointer;
  margin-left: 20px;
  text-decoration: none;
  transition: box-shadow 0.3s ease;
}

.fa.fa-refresh:hover {
  transform: translateY(-.5px);
}

.fa.fa-refresh:active {
  transform: translateY(0);
}
</style>
