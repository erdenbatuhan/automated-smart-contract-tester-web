<template>
  <v-container>
    <DataView
      data-name="submission"
      :table-headers="TABLE_HEADERS"
      :items="submissionViews"
      has-container-execution-output
      downloadable
      :functions="{
        fetchItems: fetchSubmissions,
        showContainerExecutionOutput: showContainerExecutionOutput,
        downloadItem: downloadSubmission,
      }"
    />
  </v-container>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, watch } from 'vue';
import { useStore } from 'vuex';

import DataView from '@/components/data-view/DataView.vue';

import { addDeployerToData } from '@/api/backend/services/user';
import submissionServices from '@/api/backend/services/submission';

import sortingUtils from '@/utils/sortingUtils';
import listUtils from '@/utils/listUtils';
import dateUtils from '@/utils/dateUtils';
import browserUtils from '@/utils/browserUtils';

const TABLE_HEADERS = [
  { title: '', key: 'deployer', align: 'center', sortable: false },
  { title: 'Project Name', key: 'projectName', align: 'center' },
  { title: 'Container Name', key: 'containerName', align: 'center' },
  { title: 'Status', key: 'status', align: 'center', sortable: false },
  { title: 'Total Gas', key: 'totalGas', align: 'center' },
  { title: 'Total Gas Change', key: 'totalGasChange', align: 'center' },
  { title: 'Execution Time (sec)', key: 'executionTimeSeconds', align: 'center' },
  { title: 'Submission Date', key: 'submissionDate', align: 'center' },
  { title: 'Actions', key: 'actions', align: 'center', sortable: false }
];

const props = defineProps({ lastUpdatedSubmission: { type: Object, default: null } });
const emit = defineEmits(['container-output-request', 'submission-edit']);
const store = useStore();

const submissions = ref(null);
const projects = computed(() => store.state['project'].projects);
const projectsList = computed(() => store.getters['project/projectsList']);

const submissionViews = computed(() => (
  submissions?.value?.map(({ _id, project: projectId, testStatus, results, updatedAt, deployer }) => {
    const overallResults = results?.output?.overall;

    return {
      _id,
      projectName: projects.value[projectId].projectName,
      status: (testStatus === 'Passed' ? results?.status ?? testStatus : testStatus) ?? 'Pending',
      dockerExitCode: results?.statusCode,
      containerName: results?.containerName,
      externalContainerError: results?.reason, // If this field has a value, it's an error occurred external to container's exec
      containerError: results?.output?.error, // If this field has a value, it's an error occurred during container's exec
      numTests: overallResults?.numTests,
      numPassed: overallResults?.numPassed,
      totalGas: overallResults?.totalGas,
      totalGasChange: overallResults?.totalGasChange,
      totalGasChangePercentage: overallResults?.totalGasChangePercentage,
      executionTimeSeconds: results?.executionTimeSeconds,
      submissionDate: dateUtils.formatDate(updatedAt),
      deployer: deployer.email,
      deployerRole: deployer.role
    };
  })
));

const fetchSubmissions = () => {
  submissions.value = null;

  store.dispatch('handleRequestPromise', {
    requestPromise: submissionServices.getAllSubmissions(),
    spinner: false
  })
    .then(addDeployerToData)
    .then((submissionsRetrieved) => {
      submissions.value = sortingUtils.sortByDate(submissionsRetrieved, 'updatedAt');
    })
    .catch(() => {
      submissions.value = [];
    });
};

watch(
  () => projectsList.value,
  (val) => {
    if (!!val && val.length > 0) {
      fetchSubmissions();
    }
  },
  { immediate: true }
);

watch(
  () => props.lastUpdatedSubmission,
  (lastUpdatedSubmission) => {
    if (lastUpdatedSubmission) {
      // If the updated submission is already in the list, update the list; otherwise, prepend the submission to the list
      submissions.value = listUtils.addOrUpdateItem(submissions.value, lastUpdatedSubmission, '_id');
    }
  }
);

const showContainerExecutionOutput = (viewedSubmission) => {
  const submissionIndex = submissions.value.findIndex(({ submissionName }) => submissionName === viewedSubmission.submissionName);
  emit('container-output-request', {
    submissionName: viewedSubmission.submissionName,
    config: submissions.value[submissionIndex].config,
    container: submissions.value[submissionIndex].results
  });
};

const downloadSubmission = ({ _id, projectName }) => {
  return store.dispatch('handleRequestPromise', {
    requestPromise: submissionServices.downloadSubmission(projectName, _id),
    successMessage: `Downloaded the ${projectName} submission with ID=${_id}!`
  }).then((fileResponse) => {
    // Download the file
    browserUtils.downloadFile(`${projectName}_submission_${_id}`, fileResponse);
  }).catch(() => {});
};
</script>

<style scoped>
@import "@/assets/styles/icon.css";
</style>
