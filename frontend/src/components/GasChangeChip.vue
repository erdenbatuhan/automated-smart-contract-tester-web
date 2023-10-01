<template>
  <div>
    <span
      v-if="onlyText || !fieldValue"
      :style="[colorless ? { color: 'white' } : {}]"
    > {{ formattedValue }} </span>

    <v-chip v-else :color="chipColor" size="small">
      {{ formattedValue }}
    </v-chip>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  field: { type: Object, required: true },
  onlyText: { type: Boolean, default: false },
  colorless: { type: Boolean, default: false }
});

const fieldKey = computed(() => props.field['key']);
const fieldValue = computed(() => props.field['value']);

const formattedValue = computed(() => {
  if (typeof fieldValue.value === 'number') {
    const val = fieldKey.value.toLowerCase().includes('percentage')
      ? `${fieldValue.value && fieldValue.value.toFixed(2)}%`
      : fieldValue.value;

    return (fieldValue.value > 0) ? `+${val}` : val;
  }

  return '-';
});

const chipColor = computed(() => {
  return fieldValue.value <= 0 ? 'success' : 'error';
});
</script>
