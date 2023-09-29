<template>
  <v-container>
    <v-card>
      <v-card-title>
        All Projects
      </v-card-title>

      <v-spacer />
      <RefreshController :refresh-interval="refreshInterval" @refresh="fetchProjects" />

      <v-card-text>
        <v-data-table
          class="custom-sortable"
          :items="projectViews"
          :headers="tableHeaders"
          :items-per-page="10"
          item-key="projectName"
          sortable
          :loading="!projectViews || projectViews.length === 0"
          loading-text="Loading..."
          fixed-header
        >
          <!-- Project Name -->
          <template #[`item.projectName`]="{ item }">
            <p class="text-truncate" style="width: 8em;">
              {{ item.projectName }}

              <v-tooltip activator="parent" location="top">
                {{ item.projectName }}
              </v-tooltip>
            </p>
          </template>
          <!-- # Test Contracts / # Tests -->
          <template #[`item.numContractsTests`]="{ item }">
            <p style="width: 12em;">
              {{ item.numContractsTests }}
            </p>
          </template>
          <!-- Status -->
          <template #[`item.status`]="{ item }">
            <v-tooltip bottom>
              <template #activator="{ attrs }">
                <v-container v-bind="attrs">
                  <v-chip :color="STATUS_TO_COLOR[item.status] || 'error'" size="small">
                    {{ item.status }}
                    <v-tooltip activator="parent" location="top">
                      <span v-if="typeof item.dockerExitCode === 'number'"> Docker Exit Code: {{ item.dockerExitCode }} </span>
                      <span v-else-if="item.errorReason"> Error: {{ item.errorReason }} </span>
                      <span v-else> No information available! </span>
                    </v-tooltip>
                  </v-chip>
                </v-container>
              </template>
            </v-tooltip>
          </template>
          <!-- Actions -->
          <template #[`item.actions`]="{ item }">
            <div class="d-flex">
              <!-- Project Edit Icon -->
              <v-icon
                class="clickable-icon" color="info" size="x-small"
                @click.prevent="editProject(item.projectName)"
              >
                <i class="fa fa-pencil" aria-hidden="true" />

                <v-tooltip activator="parent" location="top">
                  Edit the project
                </v-tooltip>
              </v-icon>
              <!-- Project Download Icon -->
              <v-icon
                class="clickable-icon" color="warning" size="x-small"
                @click.prevent="selectAction(downloadProject, 'Download', item.projectName)"
              >
                <i class="fa fa-download" aria-hidden="true" />

                <v-tooltip activator="parent" location="top">
                  Download the project
                </v-tooltip>
              </v-icon>
              <!-- Project Removal Icon -->
              <v-icon
                class="clickable-icon" color="error" size="x-small"
                @click.prevent="selectAction(deleteProject, 'Delete', item.projectName)"
              >
                <i class="fa fa-trash" aria-hidden="true" />

                <v-tooltip activator="parent" location="top">
                  Delete the project
                </v-tooltip>
              </v-icon>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Confirmation dialog for download and deletion -->
    <DownloadConfirmationDialog
      v-if="selectedActionName"
      :action="selectedActionName"
      :item-name="selectedProjectName"
      @confirm="takeAction"
      @decline="selectedProjectName = ''"
    />
  </v-container>
</template>

<script setup>
import { ref, defineProps, onMounted, watch } from 'vue';
import { useStore } from 'vuex';

import RefreshController from '@/components/RefreshController.vue';
import DownloadConfirmationDialog from '@/components/ConfirmationDialog.vue';

import projectServices from '@/api/backend/services/project';
import sortingUtils from '@/utils/sortingUtils';

const STATUS_TO_COLOR = { 'Pending': 'warning', 'Error': 'error', 'Failure': 'error', 'Success': 'success' };

const props = defineProps({ lastUploadedProject: { type: Object, default: null } });

const store = useStore();
const projectViews = ref([]);
const refreshInterval = ref(30);

const selectedAction = ref(() => {});
const selectedActionName = ref('');
const selectedProjectName = ref('');

const tableHeaders = [
  { title: 'Project Name', key: 'projectName', align: 'center' },
  { title: 'Status', key: 'status', align: 'center', sortable: false },
  { title: '# Contracts / # Tests', key: 'numContractsTests', align: 'center' },
  { title: 'Total Gas', key: 'totalGas', align: 'center' },
  { title: 'Build Time (sec)', key: 'imageBuildTimeSeconds', align: 'center' },
  { title: 'Image Size (MB)', key: 'imageSizeMB', align: 'center' },
  // { title: 'Created At', key: 'createdAt', align: 'center' },
  { title: 'Last Update', key: 'updatedAt', align: 'center' },
  { title: 'Actions', key: 'actions', align: 'center', sortable: false }
];

const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  };

  return new Date(dateString).toLocaleString(undefined, options);
};

const getProjectView = ({ projectName, output, createdAt, updatedAt, __v: version }) => {
  const container = output?.container;
  const overallResults = container?.output?.overall;
  const dockerImage = output?.dockerImage;

  return {
    projectName,
    status: output?.status ?? 'Pending',
    errorReason: output?.reason, // If this field has a value, it indicates an error occurred external to container's execution
    dockerExitCode: container?.statusCode,
    numContractsTests: `${overallResults?.numContracts ?? '-'} / ${overallResults?.numTests ?? '-'}`,
    totalGas: overallResults?.totalGas ?? '-',
    imageBuildTimeSeconds: dockerImage?.imageBuildTimeSeconds ?? '-',
    imageSizeMB: dockerImage?.imageSizeMB ?? '-',
    createdAt: formatDate(createdAt),
    updatedAt: formatDate(updatedAt),
    version: Number.parseInt(String(version / 2), 10)
  };
};

watch(
  () => props.lastUploadedProject,
  (lastUploadedProject) => {
    if (lastUploadedProject) {
      projectViews.value.unshift(getProjectView(lastUploadedProject));
    }
  }
);

const fetchProjects = () => {
  projectViews.value = [];

  store.dispatch('makeRequest', {
    request: projectServices.getAllProjects(),
    spinner: false
  })
    .then((projectsRetrieved) => {
      projectViews.value = sortingUtils.sortByDate(projectsRetrieved, 'updatedAt').map(getProjectView);
    })
    .catch(() => {});
};

const editProject = (editedProjectName) => {

};

const downloadProject = (selectedProjectName) => {
  return store.dispatch('makeRequest', {
    request: projectServices.downloadProject(selectedProjectName),
    successMessage: `Successfully downloaded the ${selectedProjectName} project!`
  })
    .then((response) => {
      // Create a hidden anchor element to trigger the download
      const anchor = document.createElement('a');
      anchor.style.display = 'none';
      anchor.href = window.URL.createObjectURL(new Blob([response]));
      anchor.download = `${selectedProjectName}.zip`;

      // Trigger the click event to start the download
      document.body.appendChild(anchor);
      anchor.click();

      // Clean up
      URL.revokeObjectURL(anchor.href);
    })
    .catch(() => {});
};

const deleteProject = (deletedProjectName) => {
  return store.dispatch('makeRequest', {
    request: projectServices.deleteProject(deletedProjectName),
    successMessage: `The ${deletedProjectName} project has successfully been deleted!`
  })
    .then(() => {
      // Remove the project from the list
      const projectIndex = projectViews.value.findIndex(({ projectName }) => projectName === deletedProjectName);
      projectViews.value = [
        ...projectViews.value.slice(0, projectIndex),
        ...projectViews.value.slice(projectIndex + 1)
      ];
    })
    .catch(() => {});
};

const selectAction = (action, actionName, projectName) => {
  selectedAction.value = action;
  selectedActionName.value = actionName;
  selectedProjectName.value = projectName;
};

const takeAction = () => {
  selectedAction.value(selectedProjectName.value)
    .finally(() => {
      selectedAction.value = null;
      selectedActionName.value = null;
      selectedProjectName.value = null;
    });
};

onMounted(() => {
  fetchProjects();
});
</script>

<style scoped>
@import "@/assets/styles/icon.css";

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
