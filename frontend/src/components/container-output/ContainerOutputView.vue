<template>
  <v-container v-if="projectName">
    <v-card>
      <!-- Overall Results -->
      <div v-if="overallData">
        <v-card-title>
          <v-container class="text-h6">
            Container Execution Results
          </v-container>
        </v-card-title>

        <v-card-text>
          <v-container>
            <div class="text-subtitle-2">
              <strong> Project: </strong> <i> {{ projectName }} </i>
            </div>
            <div class="text-subtitle-2">
              <strong> Command Executed: </strong> <i> {{ cmd }} </i>
            </div>
          </v-container>

          <v-data-table
            :headers="TABLE_HEADERS_OVERALL"
            :items="[{ dockerExitCode, timeoutValue, executionTimeSeconds, ...overallData }]"
            :items-per-page="1"
            density="compact"
            hide-default-footer
          >
            <template v-for="(column, index) in TABLE_HEADERS_OVERALL" #[`item.${column.key}`]="{ item }" :key="index">
              <!-- Test Status -->
              <div v-if="column.key === 'passingStatus'">
                <v-chip :color="item['passed'] ? 'success' : 'error'" size="small">
                  {{ item['passed'] ? 'Passed' : 'Failed' }}
                </v-chip>
              </div>
              <!-- Status Code -->
              <div v-else-if="column.key === 'dockerExitCode' && dockerExitCode >= 0">
                <v-chip :color="dockerExitCode === 0 ? 'success' : 'error'" size="small">
                  {{ dockerExitCode }}

                  <v-tooltip activator="parent" location="top">
                    <span v-if="containerError"> {{ containerError }}  </span>
                    <span v-else> {{ dockerExitCodeDescriptions[dockerExitCode] || 'No information available!' }} </span>
                  </v-tooltip>
                </v-chip>
              </div>
              <!-- Execution Time -->
              <div v-else-if="column.key === 'executionTimeSeconds' && executionTimeSeconds >= 0">
                <v-chip :color="executionTimeSeconds < timeoutValue ? 'success' : 'error'" size="small">
                  {{ executionTimeSeconds }}
                </v-chip>
              </div>
              <!-- Num Passed -->
              <div v-else-if="column.key === 'numPassed' && item.numPassed >= 0">
                <v-chip :color="item.numPassed ? 'success' : 'error'" size="small">
                  {{ item.numPassed }}
                </v-chip>
              </div>
              <!-- Num Failed -->
              <div v-else-if="column.key === 'numFailed' && item.numFailed >= 0">
                <v-chip :color="!item.numFailed ? 'success' : 'error'" size="small">
                  {{ item.numFailed }}
                </v-chip>
              </div>
              <!-- Gas Change & Gas Change Percentage -->
              <div v-else-if="column.key.toLowerCase().includes('gaschange') && item[column.key]">
                <gas-change-chip :field="{ key: column.key, value: item[column.key] }" />
              </div>
              <!-- Rest -->
              <div v-else>
                {{ item[column.key] || '-' }}
              </div>
            </template>

            <!-- Bottom (Hide Pagination) -->
            <template #bottom />
          </v-data-table>
        </v-card-text>
      </div>

      <!-- Test Table -->
      <div v-if="testData">
        <v-card-title>
          <v-container class="text-body-1">
            Test Results
          </v-container>

          <v-text-field
            v-model="searchedValue"
            append-icon="fa fa-search"
            label="Search"
            single-line
            hide-details
            density="compact"
          />
        </v-card-title>

        <v-card-text class="table-container">
          <v-data-table
            :headers="TABLE_HEADERS_TEST"
            :items="testData"
            :items-per-page="testData.length"
            :search="searchedValue"
            density="compact"
            hide-default-footer
          >
            <template v-for="(column, index) in TABLE_HEADERS_TEST" #[`item.${column.key}`]="{ item }" :key="index">
              <!-- Status -->
              <div v-if="column.key === 'status'">
                <v-chip :color="item.status === 'Success' ? 'success' : 'error'" size="small">
                  {{ item.status }}

                  <v-tooltip activator="parent" location="top">
                    <span v-if="item.reason">
                      {{ item.reason }}
                    </span>

                    <div v-else-if="item.logs">
                      <div
                        v-for="(logLine, logIndex) in getLogLines(item.logs)"
                        :key="`${logIndex}-${logLine}`"
                      >
                        <span style="color: white"> {{ logLine }} </span>
                      </div>
                    </div>

                    <span v-else>
                      No information available!
                    </span>
                  </v-tooltip>
                </v-chip>
              </div>
              <!-- Gas Change & Gas Change Percentage -->
              <div v-else-if="column.key.toLowerCase().includes('gaschange')">
                <gas-change-chip :field="{ key: column.key, value: item[column.key] }" />
              </div>
              <!-- Gas Usage -->
              <div v-else-if="column.key === 'gas'">
                {{ item['gas'] || '-' }}
              </div>
              <!-- Rest -->
              <div
                v-else
                class="text-truncate"
                style="max-width: 20em;"
              >
                {{ item[column.key] || '-' }}

                <v-tooltip activator="parent" location="top">
                  <span> {{ item[column.key] }} </span>
                </v-tooltip>
              </div>
            </template>

            <!-- Bottom (Hide Pagination) -->
            <template #bottom />
          </v-data-table>
        </v-card-text>
      </div>

      <!-- Test Weights Update -->
      <div v-if="isAdmin && projectConfig && projectConfig.tests && projectConfig.tests.length > 0">
        <v-container>
          <v-btn variant="outlined" size="small" @click="projectTestWeightsBeingUpdated = true">
            Update Test Weights
          </v-btn>

          <TestWeightsUpdateDialog
            :dialog-shown="projectTestWeightsBeingUpdated"
            :project-name="projectName"
            :tests="projectConfig.tests"
            @close="projectTestWeightsBeingUpdated = false"
            @test-weight-update="handleTestWeightUpdate"
          />
        </v-container>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue';
import { useStore } from 'vuex';

import dockerExitCodeDescriptions from '@/assets/data/dockerExitCodeDescriptions.json';
import GasChangeChip from '@/components/container-output/GasChangeChip.vue';
import TestWeightsUpdateDialog from '@/components/project-update/TestWeightsUpdateDialog.vue';

const TABLE_HEADERS_OVERALL = [
  { title: '# Test Contracts', key: 'numContracts', sortable: false, align: 'center' },
  { title: '# Tests', key: 'numTests', sortable: false, align: 'center' },
  { title: 'Passing Status', key: 'passingStatus', sortable: false, align: 'center' },
  { title: 'Docker Exit Code', key: 'dockerExitCode', sortable: false, align: 'center' },
  { title: 'Project Timeout (sec)', key: 'timeoutValue', sortable: false, align: 'center' },
  { title: 'Execution Time (sec)', key: 'executionTimeSeconds', sortable: false, align: 'center' },
  { title: '# Passed', key: 'numPassed', sortable: false, align: 'center' },
  { title: '# Failed', key: 'numFailed', sortable: false, align: 'center' },
  { title: 'Total Gas Usage', key: 'totalGas', sortable: false, align: 'center' },
  { title: 'Total Gas Change', key: 'totalGasChange', sortable: false, align: 'center' },
  { title: 'Total Gas Change %', key: 'totalGasChangePercentage', sortable: false, align: 'center' }
];

const TABLE_HEADERS_TEST = [
  { title: 'Test Contract', key: 'contract', align: 'center' },
  { title: 'Test', key: 'test', align: 'center' },
  { title: 'Status', key: 'status', align: 'center' },
  { title: 'Gas Usage', key: 'gas', align: 'center' },
  { title: 'Gas Change', key: 'gasChange', align: 'center' },
  { title: 'Gas Change %', key: 'gasChangePercentage', align: 'center' }
];

const props = defineProps({
  project: { type: Object, default: null }
});
const emit = defineEmits(['project-config-update']);
const store = useStore();

const isAdmin = computed(() => store.getters['user/isLoggedInAsAdmin']);

const projectName = computed(() => props.project?.projectName ?? '');
const projectConfig = computed(() => props.project?.config ?? null);

const cmd = computed(() => props.project?.container?.cmd);
const timeoutValue = computed(() => props.project?.container?.timeoutValue);
const executionTimeSeconds = computed(() => props.project?.container?.executionTimeSeconds);
const dockerExitCode = computed(() => props.project?.container?.statusCode);
const containerError = computed(() => props.project?.container?.output?.error);
const overallData = computed(() => props.project?.container?.output?.overall ?? {});
const testData = computed(() => props.project?.container?.output?.tests ?? []);

const searchedValue = ref('');
const projectTestWeightsBeingUpdated = ref(false);

const getLogLines = (logs) => logs?.split('\n') ?? [];

const handleTestWeightUpdate = (tests) => {
  projectConfig.value.tests = tests;
  projectTestWeightsBeingUpdated.value = false;

  emit('project-config-update', {
    config: {
      ...projectConfig.value.config,
      tests
    }
  });
};
</script>

<style scoped>
.table-container {
  max-height: 50vh;
  overflow-y: auto;
}
</style>
