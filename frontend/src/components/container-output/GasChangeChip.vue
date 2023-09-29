<template>
  <div>
    <span v-if="fieldValue === 0"> {{ fieldValue }} </span>

    <v-chip v-else :color="chipColor" size="small">
      {{ formattedValue }}
    </v-chip>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  fieldKey: { type: String, required: true },
  fieldValue: { type: Number, required: true }
});

const formattedValue = computed(() => (
  props.fieldKey.toLowerCase().includes('percentage')
    ? `${props.fieldValue && props.fieldValue.toFixed(2)}%`
    : props.fieldValue
));

const chipColor = computed(() => {
  return props.fieldValue <= 0 ? 'success' : 'error';
});
</script>
