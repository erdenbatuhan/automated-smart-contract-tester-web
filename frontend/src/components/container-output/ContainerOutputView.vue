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
            :headers="overallTableHeaders"
            :items="[{ statusCode, timeoutValue, executionTimeSeconds, ...overallData }]"
            :items-per-page="1"
            density="compact"
            hide-default-footer
          >
            <template v-for="(column, index) in overallTableHeaders" #[`item.${column.key}`]="{ item }" :key="index">
              <!-- Status -->
              <div v-if="column.key === 'status'">
                <v-chip :color="item.status ? 'success' : 'error'" size="small">
                  {{ item.status ? 'Passed' : 'Failed' }}
                </v-chip>
              </div>
              <!-- Status Code -->
              <div v-else-if="column.key === 'statusCode'">
                <v-chip :color="statusCode === 0 ? 'success' : 'error'" size="small">
                  {{ statusCode }}

                  <v-tooltip activator="parent" location="top">
                    <span v-if="containerError"> Error: {{ containerError }}  </span>
                    <span v-else> No information available! </span>
                  </v-tooltip>
                </v-chip>
              </div>
              <!-- Execution Time -->
              <div v-else-if="column.key === 'executionTimeSeconds'">
                <v-chip :color="executionTimeSeconds < timeoutValue ? 'success' : 'error'" size="small">
                  {{ executionTimeSeconds }}
                </v-chip>
              </div>
              <!-- Num Passed -->
              <div v-else-if="column.key === 'numPassed' && item.numPassed">
                <v-chip :color="item.numPassed ? 'success' : 'error'" size="small">
                  {{ item.numPassed }}
                </v-chip>
              </div>
              <!-- Num Failed -->
              <div v-else-if="column.key === 'numFailed' && item.numFailed">
                <v-chip :color="!item.numFailed ? 'success' : 'error'" size="small">
                  {{ item.numFailed }}
                </v-chip>
              </div>
              <!-- Gas Change & Gas Change Percentage -->
              <div v-else-if="column.key.toLowerCase().includes('gaschange') && item[column.key]">
                <gas-change-chip :field-key="column.key" :field-value="item[column.key]" />
              </div>
              <!-- Rest -->
              <div v-else>
                {{ item[column.key] }}
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
            :headers="testTableHeaders"
            :items="testData"
            :items-per-page="testData.length"
            :search="searchedValue"
            density="compact"
            hide-default-footer
          >
            <template v-for="(column, index) in testTableHeaders" #[`item.${column.key}`]="{ item }" :key="index">
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
                <gas-change-chip :field-key="column.key" :field-value="item[column.key]" />
              </div>
              <!-- Rest -->
              <div
                v-else
                class="d-flex"
                :class="{ 'justify-left': column.align === 'start', 'justify-center': column.align === 'center' }"
              >
                {{ item[column.key] }}
              </div>
            </template>

            <!-- Bottom (Hide Pagination) -->
            <template #bottom />
          </v-data-table>
        </v-card-text>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, defineProps, computed } from 'vue';

import GasChangeChip from '@/components/container-output/GasChangeChip.vue';

const props = defineProps({
  projectName: { type: String, default: '' },
  containerExecutionOutput: { type: Object, default: null }
});

const cmd = computed(() => props.containerExecutionOutput?.cmd);
const timeoutValue = computed(() => props.containerExecutionOutput?.timeoutValue);
const executionTimeSeconds = computed(() => props.containerExecutionOutput?.executionTimeSeconds);
const statusCode = computed(() => props.containerExecutionOutput?.statusCode);
const containerError = computed(() => props.containerExecutionOutput?.output?.error);
const overallData = computed(() => props.containerExecutionOutput?.output?.overall ?? {});
const testData = computed(() => props.containerExecutionOutput?.output?.tests ?? []);
const searchedValue = ref('');

const overallTableHeaders = [
  { title: '# Test Contracts', key: 'numContracts', sortable: false, align: 'center' },
  { title: '# Tests', key: 'numTests', sortable: false, align: 'center' },
  { title: 'Passing Status', key: 'status', sortable: false, align: 'center' },
  { title: 'Docker Exit Code', key: 'statusCode', sortable: false, align: 'center' },
  { title: 'Project Timeout (sec)', key: 'timeoutValue', sortable: false, align: 'center' },
  { title: 'Execution Time (sec)', key: 'executionTimeSeconds', sortable: false, align: 'center' },
  { title: '# Passed', key: 'numPassed', sortable: false, align: 'center' },
  { title: '# Failed', key: 'numFailed', sortable: false, align: 'center' },
  { title: 'Total Gas Usage', key: 'totalGas', sortable: false, align: 'center' },
  { title: 'Total Gas Change', key: 'totalGasChange', sortable: false, align: 'center' },
  { title: 'Total Gas Change %', key: 'totalGasChangePercentage', sortable: false, align: 'center' }
];

const testTableHeaders = [
  { title: 'Test Contract', key: 'contract', align: 'start' },
  { title: 'Test', key: 'test', align: 'start' },
  { title: 'Status', key: 'status', align: 'start' },
  { title: 'Gas Usage', key: 'gas', align: 'start' },
  { title: 'Gas Change', key: 'gasChange', align: 'start' },
  { title: 'Gas Change %', key: 'gasChangePercentage', align: 'start' }
];

const getLogLines = (logs) => logs?.split('\n') ?? [];
</script>

<style scoped>
.table-container {
  max-height: 50vh;
  overflow-y: auto;
}
</style>
