<template>
  <v-card>
    <v-card-title> Project Upload </v-card-title>
    <v-spacer />
    <v-card-text>
      <v-container>
        <!-- Project Name Input -->
        <v-responsive class="mx-auto" max-width="33%">
          <v-row>
            <v-col cols="10">
              <v-text-field
                v-model="projectName"
                label="Project Name"
                outlined
                density="compact"
              />
            </v-col>

            <v-col cols="2">
              <div>
                <v-icon color="tertiary" icon="fa fa-question-circle" size="x-small" />

                <v-tooltip activator="parent" location="top">
                  The name of the project uploaded
                </v-tooltip>
              </div>
            </v-col>
          </v-row>
        </v-responsive>

        <!-- File Input -->
        <v-responsive class="mx-auto" max-width="33%">
          <v-row>
            <v-col cols="10">
              <v-file-input
                v-model="projectFileUploaded"
                label="Choose a file"
                outlined
                density="compact"
                :clearable="true"
              />
            </v-col>

            <v-col cols="2">
              <div>
                <v-icon color="tertiary" icon="fa fa-question-circle" size="x-small" />

                <v-tooltip activator="parent" location="top">
                  The zipped project must include the following components:
                  <br>
                  remappings.txt, .gitmodules, the src folder, and the test folder
                </v-tooltip>
              </div>
            </v-col>
          </v-row>
        </v-responsive>

        <!-- Container Timeout -->
        <v-responsive class="mx-auto" max-width="33%">
          <v-row>
            <v-col cols="10">
              <v-text-field
                v-model="containerTimeout"
                label="Container Timeout (e.g. 15)"
                outlined
                density="compact"
              />
            </v-col>

            <v-col cols="2">
              <div>
                <v-icon color="tertiary" icon="fa fa-question-circle" size="x-small" />

                <v-tooltip activator="parent" location="top">
                  The maximum allowable timeout duration (in seconds) for the Docker containers created to execute the submissions
                </v-tooltip>
              </div>
            </v-col>
          </v-row>
        </v-responsive>

        <!-- Test Execution Arguments -->
        <v-responsive class="mx-auto" max-width="33%">
          <v-btn variant="outlined" rounded="xl" @click="toggleTestExecutionArgumentsSection">
            {{ !showTestExecutionArguments ? 'Show' : 'Hide' }} Test Execution Arguments
          </v-btn>

          <div v-if="showTestExecutionArguments" class="scrollable-div">
            <br>

            <v-row v-for="(description, argument) in availableTestExecutionArguments" :key="argument" class="dense-row">
              <v-col cols="2" class="dense-col">
                <v-checkbox v-model="selectedTestExecutionArguments[argument]" density="compact" />
              </v-col>

              <v-col cols="8" class="dense-col">
                <v-text-field
                  v-model="selectedTestExecutionArgumentValues[argument]"
                  :label="argument"
                  outlined
                  density="compact"
                  :disabled="!selectedTestExecutionArguments[argument]"
                />
              </v-col>

              <v-col cols="2" class="dense-col">
                <div>
                  <v-icon color="tertiary" icon="fa fa-question-circle" size="x-small" />

                  <v-tooltip activator="parent" location="top">
                    {{ description }}
                  </v-tooltip>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-responsive>

        <v-btn type="submit" color="secondary" size="large" rounded="xl" @click="uploadProject">
          <p class="font-weight-black">
            Upload
          </p>
        </v-btn>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from "vuex";

import projectServices from '@/api/backend/services/project';

const store = useStore();

const projectName = ref('');
const projectFileUploaded = ref(null);
const containerTimeout = ref(null);

const availableTestExecutionArguments = ref(null);
const showTestExecutionArguments = ref(false);
const selectedTestExecutionArguments = ref({});
const selectedTestExecutionArgumentValues = ref({});

const toggleTestExecutionArgumentsSection = () => {
  selectedTestExecutionArguments.value = {};
  showTestExecutionArguments.value = !showTestExecutionArguments.value;
};

// Handle the file upload and project name submission
const uploadProject = () => {
  const projectConfig = {
    containerTimeout: containerTimeout.value,
    testExecutionArguments: Object.entries(selectedTestExecutionArguments.value || {})
      .reduce((accum, [ arg, selected ]) => {
        if (selected) accum[arg] = selectedTestExecutionArgumentValues.value[arg];
        return accum;
      }, {})
  };

  console.log(projectConfig);
  // Handle the file upload logic here
};

onMounted(() => {
  store.dispatch('makeRequest', { request: projectServices.getAvailableTestExecutionArguments(), spinner: true })
    .then((testExecutionArguments) => {
      availableTestExecutionArguments.value = testExecutionArguments;
    })
    .catch(() => {});
});
</script>

<style scoped>
.scrollable-div {
  height: 15em;
  overflow-y: auto;
}

.dense-row {
  margin-top: 6px;

  .dense-col {
    padding: 0 12px;
  }
}

button[type=submit] {
  margin-top: 2em;
}
</style>
