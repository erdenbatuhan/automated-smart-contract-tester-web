<template>
  <div>
    <v-card>
      <v-card-title>
        All Projects
      </v-card-title>

      <v-spacer />
      <RefreshController :refresh-interval="refreshInterval" @refresh="fetchProjects" />

      <v-card-text>
        <v-data-table
          :items="projectViews"
          :headers="tableHeaders"
          :items-per-page="10"
          item-key="projectName"
          :loading="!projectViews || projectViews.length === 0"
          loading-text="Loading..."
        >
          <template #[`item.status`]="{ item }">
            <v-tooltip bottom>
              <template #activator="{ attrs }">
                <div v-bind="attrs" class="d-flex align-center">
                  <v-chip :color="STATUS_TO_COLOR[item.status] || 'error'">
                    {{ item.status }}

                    <v-tooltip activator="parent" location="top">
                      <span v-if="typeof item.dockerExitCode === 'number'"> Docker Exit Code: {{ item.dockerExitCode }} </span>
                      <span v-else-if="item.errorReason"> Error: {{ item.errorReason }} </span>
                      <span v-else> No information available! </span>
                    </v-tooltip>
                  </v-chip>
                </div>
              </template>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted, watch } from 'vue';
import { useStore } from 'vuex';

import RefreshController from '@/components/RefreshController.vue';

import projectServices from '@/api/backend/services/project';
import sortingUtils from '@/utils/sortingUtils';

const STATUS_TO_COLOR = { 'Pending': 'warning', 'Error': 'error', 'Failure': 'error', 'Success': 'success' };

const props = defineProps({
  lastUploadedProject: { type: Object, default: null }
});

const store = useStore();
const projectViews = ref([]);
const refreshInterval = ref(30);

const tableHeaders = [
  { title: 'Project Name', key: 'projectName', width: '25%', align: 'center' },
  { title: 'Status', key: 'status', width: '10%', align: 'center' },
  { title: 'Number of Test Contracts', key: 'numContracts', width: '5%', align: 'center' },
  { title: 'Number of Tests', key: 'numTests', width: '5%', align: 'center' },
  { title: 'Total Gas', key: 'totalGas', width: '10%', align: 'center' },
  { title: 'Build Time (sec)', key: 'imageBuildTimeSeconds', width: '5%', align: 'center' },
  { title: 'Image Size (MB)', key: 'imageSizeMB', width: '5%', align: 'center' },
  // { title: 'Created At', key: 'createdAt', width: '15%', align: 'center' },
  { title: 'Last Update', key: 'updatedAt', width: '15%', align: 'center' },
  { title: 'Version', key: 'version', width: '5%', align: 'center' }
];

const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  };

  return new Date(dateString).toLocaleString(undefined, options);
};

const getProjectView = ({ projectName, output, createdAt, updatedAt, __v: version }) => ({
  projectName,
  status: output?.status ?? 'Pending',
  errorReason: output?.reason, // If this field has a value, it indicates an error occurred external to the container's execution
  dockerExitCode: output?.container?.statusCode,
  numContracts: output?.container?.output?.overall?.numContracts ?? '-',
  numTests: output?.container?.output?.overall?.numTests ?? '-',
  totalGas: output?.container?.output?.overall?.totalGas ?? '-',
  imageBuildTimeSeconds: output?.dockerImage?.imageBuildTimeSeconds ?? '-',
  imageSizeMB: output?.dockerImage?.imageSizeMB ?? '-',
  createdAt: formatDate(createdAt),
  updatedAt: formatDate(updatedAt),
  version: Number.parseInt(String(version / 2), 10)
});

watch(
  () => props.lastUploadedProject,
  (lastUploadedProject) => {
    projectViews.value.unshift(getProjectView(lastUploadedProject));
  }
);

const fetchProjects = () => {
  store.dispatch('makeRequest', { request: projectServices.getAllProjects(), spinner: false })
    .then((projectsRetrieved) => {
      projectViews.value = sortingUtils.sortByDate(projectsRetrieved, 'updatedAt').map(getProjectView);
    })
    .catch(() => {});
};

onMounted(() => {
  fetchProjects();
});
</script>

<style scoped>

</style>
