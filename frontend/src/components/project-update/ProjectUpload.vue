<template>
  <v-container>
    <v-card>
      <v-card-title> Project Upload </v-card-title>
      <v-card-subtitle> {{ !isEditMode ? 'Upload a new' : 'Update an existing' }} project </v-card-subtitle>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col :offset="4" :cols="4">
              <!-- Project Name Input -->
              <v-text-field
                v-model="projectName"
                class="compact-input"
                label="Project Name"
                :maxlength="20"
                outlined
                density="compact"
                :rules="rules['projectName']"
                :disabled="isEditMode"
                @input="() => { projectNameEdited = true }"
              >
                <template #prepend-inner>
                  <v-icon color="tertiary" icon="fa fa-file-text" size="x-small" />
                </template>

                <template #append>
                  <div>
                    <v-icon color="tertiary" icon="fa fa-question-circle" size="x-small" />

                    <v-tooltip activator="parent" location="top">
                      The name of the project uploaded
                    </v-tooltip>
                  </div>
                </template>
              </v-text-field>

              <!-- File Input -->
              <v-file-input
                v-model="projectFiles"
                class="compact-input"
                accept=".zip"
                label="Choose a file"
                prepend-icon=""
                :clearable="true"
                outlined
                density="compact"
                :rules="rules['projectFiles']"
              >
                <template #prepend-inner>
                  <v-icon color="tertiary" icon="fa fa-paperclip" size="x-small" />
                </template>

                <template #append>
                  <div>
                    <v-icon color="tertiary" icon="fa fa-question-circle" size="x-small" />

                    <v-tooltip activator="parent" location="top">
                      The zipped project must include the following components:
                      <br>
                      remappings.txt, .gitmodules, the src folder, and the test folder
                    </v-tooltip>
                  </div>
                </template>
              </v-file-input>

              <!-- Container Timeout -->
              <v-text-field
                v-model="containerTimeout"
                class="compact-input"
                label="Container Timeout (e.g. 15)"
                outlined
                density="compact"
                :rules="rules['containerTimeout']"
              >
                <template #prepend-inner>
                  <v-icon color="tertiary" icon="fa fa-clock" size="x-small" />
                </template>

                <template #append>
                  <div>
                    <v-icon color="tertiary" icon="fa fa-question-circle" size="x-small" />

                    <v-tooltip activator="parent" location="top">
                      The maximum allowable timeout duration (in seconds)
                      for the Docker containers created to execute the submissions
                    </v-tooltip>
                  </div>
                </template>
              </v-text-field>

              <!-- Test Execution Arguments -->
              <div>
                <v-btn variant="outlined" size="small" @click="toggleTestExecutionArgumentsSection">
                  {{ !showTestExecutionArguments ? 'Show' : 'Hide' }} Test Execution Arguments
                </v-btn>

                <div v-if="showTestExecutionArguments" class="scrollable-div">
                  <br>

                  <v-row v-for="(description, argument) in availableTestExecutionArguments" :key="argument" class="dense-row">
                    <v-col cols="1" class="dense-col align-center">
                      <v-checkbox v-model="selectedTestExecutionArguments[argument]" class="text-sm-caption" density="compact" />
                    </v-col>

                    <v-col cols="11" class="dense-col">
                      <v-text-field
                        v-model="selectedTestExecutionArgumentValues[argument]"
                        :label="argument"
                        outlined
                        density="compact"
                        :disabled="!selectedTestExecutionArguments[argument]"
                      >
                        <template #append>
                          <div>
                            <v-icon color="tertiary" icon="fa fa-question-circle" size="x-small" />

                            <v-tooltip activator="parent" location="top">
                              {{ description }}
                            </v-tooltip>
                          </div>
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>

        <v-btn type="submit" color="secondary" size="large" rounded="xl" @click.prevent="uploadProject">
          <p class="font-weight-black">
            Upload
          </p>
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { HttpStatusCode } from 'axios';

import projectServices from '@/api/backend/services/project';

const store = useStore();

const props = defineProps({ projectEdited: { type: Object, default: null } });
const emit = defineEmits(['project-upload', 'project-config-update']);

const isEditMode = computed(() => !!props.projectEdited);

let projectName;
let projectNameEdited;
let projectFiles;
let containerTimeout;

const availableTestExecutionArguments = ref(null);
let showTestExecutionArguments;
let selectedTestExecutionArguments;
let selectedTestExecutionArgumentValues;

watch(
  () => props.projectEdited,
  (val) => {
    projectName = ref(val?.projectName ?? '');
    projectNameEdited = ref(false);
    projectFiles = ref(null);
    containerTimeout = ref(val?.config?.containerTimeout ?? null);

    showTestExecutionArguments = ref(false);
    selectedTestExecutionArguments = ref({});
    selectedTestExecutionArgumentValues = ref({});

    // Download the project files
    if (val?.projectName) {
      store.dispatch('handleRequestPromise', {
        requestPromise: projectServices.downloadProject(val.projectName)
      }).then((response) => {
        const file = new Blob([response]);
        file.name = `${val.projectName}.zip`;

        projectFiles.value = [file];
      });
    }

    // Set the test execution arguments
    if (val?.config) {
      Object.entries(val.config.testExecutionArguments || {}).forEach(([arg, value]) => {
        showTestExecutionArguments.value = true;
        selectedTestExecutionArguments.value[arg] = true;
        selectedTestExecutionArgumentValues.value[arg] = value;
      });
    }
  },
  { immediate: true }
);

const rules = {
  projectName: [
    v => !projectNameEdited.value || !!v || 'This field is required'
  ],
  projectFiles: [
    v => (!!v && v.length > 0 && !!v[0]) || 'This field is required'
  ],
  containerTimeout: [
    // v => !!v || 'This field is required',
    v => !v || (0 < v && v <= 300) || 'Please enter a value between 0 and 300'
  ]
};

const toggleTestExecutionArgumentsSection = () => {
  selectedTestExecutionArguments.value = {};
  showTestExecutionArguments.value = !showTestExecutionArguments.value;
};

const checkFields = () => {
  const validation = [
    ...rules.projectName.map(rule => rule(projectName.value)),
    ...rules.projectFiles.map(rule => rule(projectFiles.value)),
    ...rules.containerTimeout.map(rule => rule(containerTimeout.value))
  ];

  if (validation.every((val) => val === true)) {
    return true;
  }

  store.commit('global/setAlert', {
    status: HttpStatusCode.BadRequest,
    statusText: 'Bad Request',
    data: 'Please fill in the required fields!'
  });

  return false;
};

const uploadProject = () => {
  if (!checkFields()) return;

  // Extract project config
  const projectConfig = {
    containerTimeout: containerTimeout.value,
    testExecutionArguments: Object.entries(selectedTestExecutionArguments.value || {})
      .reduce((accum, [ arg, selected ]) => {
        if (selected) accum[arg] = selectedTestExecutionArgumentValues.value[arg];
        return accum;
      }, {})
  };

  // Choose the right upload function
  let uploadPromise = isEditMode.value
    ? projectServices.uploadExistingProject(projectName.value, projectFiles.value[0], { projectConfig })
    : projectServices.uploadNewProject(projectName.value, projectFiles.value[0], { projectConfig });

  // Upload project
  store.dispatch('handleRequestPromise', { requestPromise: uploadPromise }).then(({ project }) => {
    emit('project-upload', { project });
  }).catch(() => {});
};

onMounted(() => {
  store.dispatch('handleRequestPromise', { requestPromise: projectServices.getAvailableTestExecutionArguments() })
    .then((testExecutionArguments) => {
      availableTestExecutionArguments.value = testExecutionArguments;
    })
    .catch(() => {});
});
</script>

<style scoped>
.compact-input {
  margin-bottom: 5px;
}

.scrollable-div {
  height: 15em;
  overflow-x: hidden;
  overflow-y: auto;
}

.dense-row {
  margin-top: 6px;

  .dense-col {
    padding: 0 12px;

    .v-icon {
      padding-top: 10px;
    }
  }
}

.v-col .padded-div {
  padding-bottom: 16px;
}

button[type=submit] {
  margin-top: 2em;
}
</style>
