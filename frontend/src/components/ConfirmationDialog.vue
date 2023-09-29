<template>
  <v-dialog v-model="dialogShown" max-width="800">
    <v-card v-if="action && itemName">
      <v-card-title>Confirm {{ action }}</v-card-title>

      <v-card-text class="text-subtitle-2">
        Do you want to {{ action.toLowerCase() }} <strong> {{ itemName }} </strong>?
      </v-card-text>

      <v-card-actions>
        <v-container>
          <v-btn color="info" size="small" rounded="xl" @click.prevent="confirm">
            {{ action }}
          </v-btn>

          <v-btn color="error" size="small" rounded="xl" @click.prevent="dialogShown = false">
            Cancel
          </v-btn>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, watch, watchEffect, defineProps } from 'vue';

const props = defineProps({
  action: { type: String, default: '' },
  itemName: { type: String, default: '' }
});
const emit = defineEmits(['confirm', 'decline']);

const action = ref('');
const itemName = ref('');
const dialogShown = ref(false);

const confirm = () => {
  emit('confirm', itemName.value);

  action.value = '';
  itemName.value = '';
  dialogShown.value = false;
};

const handleDialogClose = () => {
  if (itemName.value) {
    emit('decline', itemName.value);
  }
};

onMounted(() => {
  // Watcher for props.itemName
  watchEffect(() => {
    if (props.action && props.itemName) {
      action.value = props.action;
      itemName.value = props.itemName;
      dialogShown.value = true;
    }
  });

  // Watcher for dialogShown
  watch(
    () => dialogShown.value,
    (newValue, oldValue) => {
      console.log(newValue, oldValue);
      if (oldValue && !newValue) {
        handleDialogClose();
      }
  });
});
</script>
