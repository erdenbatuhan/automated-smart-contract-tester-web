<template>
  <v-container>
    <DataView
      data-name="project"
      :table-headers="TABLE_HEADERS"
      :items="projectViews"
      has-container-execution-output
      editable
      downloadable
      deletable
      :functions="{
        fetchItems: fetchProjects,
        showContainerExecutionOutput: showContainerExecutionOutput,
        editItem: editProject,
        downloadItem: downloadProject,
        deleteItem: deleteProject
      }"
    />
  </v-container>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';

import DataView from '@/components/DataView.vue';

import projectServices from '@/api/backend/services/project';

import sortingUtils from '@/utils/sortingUtils';
import listUtils from '@/utils/listUtils';
import dateUtils from '@/utils/dateUtils';
import browserUtils from '@/utils/browserUtils';

const TABLE_HEADERS = [
  { title: 'Project Name', key: 'projectName', align: 'center' },
  { title: 'Status', key: 'status', align: 'center', sortable: false },
  { title: 'Contract Count', key: 'numContracts', align: 'center' },
  { title: 'Test Count', key: 'numTests', align: 'center' },
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

const projects = ref([]);
const projectViews = computed(() => (
  projects?.value?.map(({ _id: id, projectName, testStatus, results, createdAt, updatedAt, __v: version }) => {
    const container = results?.container;
    const overallResults = container?.output?.overall;
    const dockerImage = results?.dockerImage;

    return {
      id,
      projectName,
      status: (testStatus === 'Passed' ? results?.status ?? testStatus : testStatus) ?? 'Pending',
      externalContainerError: results?.reason, // If this field has a value, it's an error occurred external to container's exec
      containerError: container?.output?.error, // If this field has a value, it's an error occurred during container's exec
      dockerExitCode: container?.statusCode,
      numContracts: overallResults?.numContracts ?? '-',
      numTests: overallResults?.numTests ?? '-',
      totalGas: overallResults?.totalGas ?? '-',
      imageBuildTimeSeconds: dockerImage?.imageBuildTimeSeconds ?? '-',
      imageSizeMB: dockerImage?.imageSizeMB ?? '-',
      createdAt: dateUtils.formatDate(createdAt),
      updatedAt: dateUtils.formatDate(updatedAt),
      version: version
    };
  })
));

watch(
  () => props.lastUpdatedProject,
  (lastUpdatedProject) => {
    if (lastUpdatedProject) {
      // If the updated project is already in the list, update the list; otherwise, prepend the project to the list
      projects.value = listUtils.addOrUpdateItem(projects.value, lastUpdatedProject, '_id');
    }
  }
);

const showContainerExecutionOutput = (viewedProject) => {
  const projectIndex = projects.value.findIndex(({ projectName }) => projectName === viewedProject.projectName);
  emit('container-output-request', {
    projectName: viewedProject.projectName,
    config: projects.value[projectIndex].config,
    container: projects.value[projectIndex].results?.container
  });
};

const editProject = (editedProjectName) => {
  const projectIndex = projects.value.findIndex(({ projectName }) => projectName === editedProjectName.projectName);
  emit('project-edit', { project: projects.value[projectIndex] });
};

const downloadProject = (selectedProject) => {
  return store.dispatch('handleRequestPromise', {
    requestPromise: projectServices.downloadProject(selectedProject.projectName),
    successMessage: `Successfully downloaded the ${selectedProject.projectName} project!`
  }).then((fileResponse) => {
    // Download the file
    browserUtils.downloadFile(selectedProject.projectName, fileResponse);
  }).catch(() => {});
};

const deleteProject = (deletedProject) => {
  return store.dispatch('handleRequestPromise', {
    requestPromise: projectServices.deleteProject(deletedProject.projectName),
    successMessage: `The ${deletedProject.projectName} project has successfully been deleted!`
  }).then(() => {
    // Remove the project from the list
    projects.value = listUtils.removeItem(projects.value, deletedProject, 'projectName');
  }).catch(() => {});
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
