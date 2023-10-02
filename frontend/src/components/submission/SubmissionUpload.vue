<template>
  <v-container>
    <v-card>
      <v-card-title> Submission Upload </v-card-title>
      <v-card-subtitle> Upload a new submission </v-card-subtitle>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col :offset="4" :cols="4">
              <!-- Project Name Dropdown -->
              <v-select
                v-model="selectedProjectName"
                :items="projectNames"
                class="compact-input"
                label="Project Name"
                density="compact"
                hide-details
                style="margin-bottom: 20px;"
              >
                <template #prepend-inner>
                  <v-icon color="tertiary" icon="fa fa-file-text" size="x-small" />
                </template>

                <template #append>
                  <div>
                    <v-icon color="tertiary" icon="fa fa-question-circle" size="x-small" />

                    <v-tooltip activator="parent" location="top">
                      The name of the project for which the submission is uploaded
                    </v-tooltip>
                  </div>
                </template>
              </v-select>

              <!-- File Input -->
              <v-file-input
                v-model="submissionFiles"
                class="compact-input"
                accept=".zip"
                label="Choose a file"
                prepend-icon=""
                :clearable="true"
                outlined
                density="compact"
                :rules="rules['submissionFiles']"
              >
                <template #prepend-inner>
                  <v-icon color="tertiary" icon="fa fa-paperclip" size="x-small" />
                </template>

                <template #append>
                  <div>
                    <v-icon color="tertiary" icon="fa fa-question-circle" size="x-small" />

                    <v-tooltip activator="parent" location="top">
                      The zipped src folder containing the smart contracts
                    </v-tooltip>
                  </div>
                </template>
              </v-file-input>
            </v-col>
          </v-row>
        </v-container>

        <v-btn
          type="submit" color="secondary" size="large" rounded="xl"
          :disabled="!selectedProjectName"
          @click.prevent="uploadSubmission"
        >
          <p class="font-weight-black">
            Upload
          </p>
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { defineEmits, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { HttpStatusCode } from 'axios';

import submissionServices from '@/api/backend/services/submission';

const emit = defineEmits(['submission-upload']);
const store = useStore();

const projectNames = computed(() => (store.getters['project/successfulProjectNames'] || []));

let selectedProjectName = ref(null);
let submissionFiles = ref(null);

const rules = {
  submissionFiles: [
    v => (!!v && v.length > 0 && !!v[0]) || 'This field is required'
  ]
};

const checkIfFileUploaded = () => {
  const validation = rules.submissionFiles.map(rule => rule(submissionFiles.value));

  if (validation.every((val) => val === true)) {
    return true;
  }

  store.commit('global/setAlert', {
    status: HttpStatusCode.BadRequest,
    statusText: 'Bad Request',
    data: 'Please upload a file!'
  });

  return false;
};

const uploadSubmission = () => {
  if (!checkIfFileUploaded()) return;

  // Upload submission
  store.dispatch('handleRequestPromise', {
    requestPromise: submissionServices.uploadSubmission(selectedProjectName.value, submissionFiles.value[0]),
    successMessage: `Successfully uploaded the submission for the ${selectedProjectName.value} project!`
  }, { root: true })
    .then(({ submission: submissionUploaded }) => {
      emit('submission-upload', submissionUploaded);
    })
    .catch(() => {});
};
</script>

<style scoped>

</style>
