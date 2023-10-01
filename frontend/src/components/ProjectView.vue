<template>
  <v-container>
    <v-card>
      <v-card-title>
        All Projects
      </v-card-title>

      <RefreshController :refresh-interval="refreshInterval" @refresh="fetchProjects" />

      <v-card-text>
        <!-- Table for Projects -->
        <v-data-table
          class="custom-sortable"
          :headers="TABLE_HEADERS"
          :items="projectViews"
          :items-per-page="10"
          item-key="projectName"
          sortable
          :loading="spinner && (!projectViews || projectViews.length === 0)"
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
            <div>
              <v-chip :color="STATUS_TO_COLOR[item.status] || 'error'" size="small">
                {{
                  item.status.split(' ').length <= 2 ? (
                    item.status !== 'Inconclusive' ? item.status : 'Pending'
                  ) : item.status.split(' ').slice(-2).join(' ')
                }}

                <v-tooltip activator="parent" location="top">
                  <div v-if="typeof item.dockerExitCode === 'number'">
                    <span style="color: white"> Docker Exit Code: {{ item.dockerExitCode }} </span>
                    <br>
                    <span v-if="item.containerError" style="color: white"> {{ item.containerError }}  </span>
                  </div>
                  <span v-else-if="item.externalContainerError"> Error: {{ item.externalContainerError }} </span>
                  <span v-else> No information available! </span>
                </v-tooltip>
              </v-chip>
            </div>
          </template>
          <!-- Actions -->
          <template #[`item.actions`]="{ item }">
            <div v-if="!['Inconclusive', 'Pending'].includes(item.status)" class="d-flex">
              <!-- Project Execution Output Icon -->
              <v-icon
                v-if="['Error', 'Failure', 'Success', 'Failed', 'Passed'].includes(item.status)"
                class="clickable-icon" color="info" size="x-small"
                @click.prevent="showContainerExecutionOutput(item.projectName)"
              >
                <i class="fa fa-bar-chart" aria-hidden="true" />

                <v-tooltip activator="parent" location="top">
                  Show project execution output
                </v-tooltip>
              </v-icon>
              <v-icon v-else class="clickable-icon" size="x-small" disabled />
              <!-- Project Edit Icon -->
              <v-icon
                class="clickable-icon" color="success" size="x-small"
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
import { defineProps, defineEmits, ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';

import RefreshController from '@/components/RefreshController.vue';
import DownloadConfirmationDialog from '@/components/ConfirmationDialog.vue';

import projectServices from '@/api/backend/services/project';
import sortingUtils from '@/utils/sortingUtils';

const STATUS_TO_COLOR = {
  'Inconclusive': 'warning', 'Pending': 'warning',
  'Error': 'error', 'Failure': 'error',  'Failed': 'error',
  'Success': 'success', 'Passed': 'success'
};

const TABLE_HEADERS = [
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

const props = defineProps({ lastUpdatedProject: { type: Object, default: null } });
const emit = defineEmits(['container-output-request', 'project-edit']);
const store = useStore();

const spinner = computed(() => store.getters['global/spinner']);

const projects = ref([]);
const projectViews = computed(() => projects?.value?.map(getProjectView));
const refreshInterval = ref(60);

const selectedAction = ref(() => {});
const selectedActionName = ref('');
const selectedProjectName = ref('');

watch(
  () => props.lastUpdatedProject,
  (lastUpdatedProject) => {
    if (lastUpdatedProject) {
      // If the updated project is already in the list, update the list; otherwise, prepend the project to the list
      const projectIndex = projects.value.findIndex(({ _id }) => _id === lastUpdatedProject._id);

      if (projectIndex !== -1) {
        projects.value[projectIndex] = lastUpdatedProject;
      } else {
        projects.value.unshift(lastUpdatedProject);
      }
    }
  }
);

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

const getProjectView = ({ projectName, testStatus, results, createdAt, updatedAt, __v: version }) => {
  const container = results?.container;
  const overallResults = container?.output?.overall;
  const dockerImage = results?.dockerImage;

  return {
    projectName,
    status: (testStatus === 'Passed' ? results?.status ?? testStatus : testStatus) ?? 'Pending',
    externalContainerError: results?.reason, // If this field has a value, it's an error occurred external to container's exec
    containerError: container?.output?.error, // If this field has a value, it's an error occurred during container's exec
    dockerExitCode: container?.statusCode,
    numContractsTests: `${overallResults?.numContracts ?? '-'} / ${overallResults?.numTests ?? '-'}`,
    totalGas: overallResults?.totalGas ?? '-',
    imageBuildTimeSeconds: dockerImage?.imageBuildTimeSeconds ?? '-',
    imageSizeMB: dockerImage?.imageSizeMB ?? '-',
    createdAt: formatDate(createdAt),
    updatedAt: formatDate(updatedAt),
    version: version
  };
};

const showContainerExecutionOutput = (viewedProjectName) => {
  const projectIndex = projects.value.findIndex(({ projectName }) => projectName === viewedProjectName);
  emit('container-output-request', {
    projectName: viewedProjectName,
    config: projects.value[projectIndex].config,
    container: projects.value[projectIndex].results?.container
  });
};

const editProject = (editedProjectName) => {
  const projectIndex = projects.value.findIndex(({ projectName }) => projectName === editedProjectName);
  emit('project-edit', { project: projects.value[projectIndex] });
};

const downloadProject = (selectedProjectName) => {
  return store.dispatch('handleRequestPromise', {
    requestPromise: projectServices.downloadProject(selectedProjectName),
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
  return store.dispatch('handleRequestPromise', {
    requestPromise: projectServices.deleteProject(deletedProjectName),
    successMessage: `The ${deletedProjectName} project has successfully been deleted!`
  })
    .then(() => {
      // Remove the project from the list
      const projectIndex = projects.value.findIndex(({ projectName }) => projectName === deletedProjectName);
      projects.value = [
        ...projects.value.slice(0, projectIndex),
        ...projects.value.slice(projectIndex + 1)
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

const fetchProjects = () => {
  projects.value = [];

  store.dispatch('handleRequestPromise', {
    requestPromise: projectServices.getAllProjects(),
    spinner: false
  })
    .then((projectsRetrieved) => {
      projects.value = sortingUtils.sortByDate(projectsRetrieved, 'updatedAt');
    })
    .catch(() => {});
};

onMounted(() => {
  fetchProjects();
});
</script>

<style scoped>
@import "@/assets/styles/icon.css";
</style>
