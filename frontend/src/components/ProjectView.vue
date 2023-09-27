<template>
  <div>
    <v-card>
      <v-card-title>All Projects</v-card-title>
      <v-spacer />
      <v-card-text>
        <v-data-table
          :items="projectViews"
          :headers="tableHeaders"
          :items-per-page="5"
        >
          <template #[`item.status`]="{ item }">
            <v-tooltip bottom>
              <template #activator="{ attrs }">
                <div v-bind="attrs" class="d-flex align-center">
                  <v-chip :color="STATUS_TO_COLOR[item.status]">
                    {{ item.status }}

                    <v-tooltip activator="parent" location="top">
                      Docker Exit Code: {{ item.statusCode }}
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
import { ref, onMounted } from 'vue';
import { useStore } from "vuex";

import projectServices from '@/api/backend/services/project';

const STATUS_TO_COLOR = { "Pending": "warning", "Success": "success", "Failure": "error" };

const store = useStore();
const projectViews = ref([]);

const tableHeaders = [
  { title: 'Project Name', key: 'projectName', width: '25%', align: 'center' },
  { title: 'Status', key: 'status', width: '10%', align: 'center' },
  { title: 'Number of Test Contracts', key: 'numContracts', width: '5%', align: 'center' },
  { title: 'Number of Tests', key: 'numTests', width: '5%', align: 'center' },
  { title: 'Total Gas', key: 'totalGas', width: '10%', align: 'center' },
  { title: 'Build Time (sec)', key: 'imageBuildTimeSeconds', width: '5%', align: 'center' },
  { title: 'Image Size (MB)', key: 'imageSizeMB', width: '5%', align: 'center' },
  { title: 'Created At', key: 'createdAt', width: '15%', align: 'center' },
  { title: 'Updated At', key: 'updatedAt', width: '15%', align: 'center' },
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
  statusCode: String(output?.container?.statusCode),
  numContracts: output?.container?.output?.overall?.numContracts ?? '-',
  numTests: output?.container?.output?.overall?.numTests ?? '-',
  totalGas: output?.container?.output?.overall?.totalGas ?? '-',
  imageBuildTimeSeconds: output?.dockerImage?.imageBuildTimeSeconds ?? '-',
  imageSizeMB: output?.dockerImage?.imageSizeMB ?? '-',
  createdAt: formatDate(createdAt),
  updatedAt: formatDate(updatedAt),
  version: Number.parseInt(String(version / 2), 10)
});

onMounted(() => {
  store.dispatch('makeRequest', { request: projectServices.getAllProjects(), spinner: false })
    .then((projectsRetrieved) => {
      projectViews.value = projectsRetrieved.map(getProjectView);
    })
    .catch(() => {});
});
</script>
