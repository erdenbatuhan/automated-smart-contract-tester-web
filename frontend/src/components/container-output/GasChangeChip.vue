<template>
  <div>
    <span v-if="!fieldValue"> {{ fieldValue || '-' }} </span>

    <v-chip v-else :color="chipColor" size="small">
      {{ formattedValue }}
    </v-chip>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  field: { type: Object, required: true }
});

const fieldKey = computed(() => props.field['key']);
const fieldValue = computed(() => props.field['value']);

const formattedValue = computed(() => (
  fieldKey.value.toLowerCase().includes('percentage')
    ? `${fieldValue.value && fieldValue.value.toFixed(2)}%`
    : fieldValue
));

const chipColor = computed(() => {
  return fieldValue.value <= 0 ? 'success' : 'error';
});
</script>
