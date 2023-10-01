<template>
  <v-dialog v-model="dialogShown" :scrollable="true" width="auto">
    <v-card>
      <v-card-title>
        Update Test Weights
      </v-card-title>

      <v-card-text v-if="projectName && tests">
        <div class="scrollable-div">
          <v-text-field
            v-for="({ contract, test }, index) in tests" :key="test"
            v-model="tests[index].weight"
            class="compact-input"
            outlined
            type="number"
            density="compact"
            :rules="rules.testWeight"
          >
            <template #prepend>
              <div style="width: 25em">
                <p class="text-truncate text-sm-caption">
                  {{ `${index}) ${contract}:${test}` }}
                </p>

                <v-tooltip activator="parent" location="top">
                  {{ `${contract}:${test}` }}
                </v-tooltip>
              </div>
            </template>
          </v-text-field>
        </div>

        <v-container>
          <v-btn
            class="font-weight-black" style="margin-bottom: 10px"
            color="info" size="small" rounded="xl"
            @click="resetWeights"
          >
            Reset
          </v-btn>
          <br>
          <v-btn
            class="font-weight-black"
            color="secondary" size="small" rounded="xl"
            :disabled="!validateInputs()" @click="updateWeights"
          >
            Update
          </v-btn>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-container>
          <v-btn color="error" @click.prevent="dialogShown = false">
            Cancel
          </v-btn>
        </v-container>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, watchEffect } from 'vue';

const props = defineProps({
  dialogShown: { type: Boolean, default: false },
  projectName: { type: String, default: null },
  tests: { type: Array, default: () => [] }
});
const emit = defineEmits(['close', 'test-weight-update']);

const dialogShown = ref(false);
const projectName = ref(null);
const tests = ref([]);

watchEffect(
  () => {
    dialogShown.value = props.dialogShown;
    projectName.value = props.projectName;
    tests.value = props.tests;
  }
);

watch(
  () => dialogShown.value,
  (val) => {
    if (!val) emit('close');
  }
);

const rules = {
  testWeight: [
    v => !!v || 'This field is required',
    v => !v || (0 < v && v <= 100) || 'Please enter a value between 0 and 100'
  ]
};

const resetWeights = () => {
  tests.value = tests.value.map((test) => {
    test.weight = 1;
    return test;
  });
};

const validateInputs = () => {
  const validation = rules.testWeight
    .map(rule => tests.value
      .map(({ weight }) => rule(weight))
      .flat())
    .flat();

  return validation.every((val) => val === true);
};

const updateWeights = () => {
  dialogShown.value = false;
  emit('test-weight-update', tests.value);
};
</script>

<style scoped>
.compact-input {
  margin-bottom: 5px;
}

.scrollable-div {
  height: 24em;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
