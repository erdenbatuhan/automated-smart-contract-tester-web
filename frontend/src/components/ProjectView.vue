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
import { defineEmits, ref, computed, watch } from 'vue';
import { useStore } from 'vuex';

import DataView from '@/components/data-view/DataView.vue';

import projectServices from '@/api/backend/services/project';

import dateUtils from '@/utils/dateUtils';
import browserUtils from '@/utils/browserUtils';

const TABLE_HEADERS = [
  { title: '', key: 'deployer', align: 'center', sortable: false },
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

const emit = defineEmits(['container-output-request', 'project-edit']);
const store = useStore();

const projects = ref(null);
const projectViews = computed(() => (
  projects?.value?.map(({ _id, projectName, testStatus, results, createdAt, updatedAt, deployer }) => {
    const container = results?.container;
    const overallResults = container?.output?.overall;
    const dockerImage = results?.dockerImage;

    return {
      _id,
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
      deployer: deployer.email
    };
  })
));

watch(
  () => store.getters['project/projectsList'],
  (val) => {
    projects.value = val;
  }
);

const fetchProjects = () => store.dispatch('project/fetchProjects');

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
  })
    .then((fileResponse) => {
      // Download the file
      browserUtils.downloadFile(selectedProject.projectName, fileResponse);
    })
    .catch(() => {});
};

const deleteProject = (deletedProject) => store.dispatch('project/deleteProject', deletedProject).catch(() => {});
</script>

<style scoped>
@import "@/assets/styles/icon.css";
</style>
