<template>
  <v-container>
    <DataView
      data-name="submission"
      :refresh-interval="20"
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

import { addUsers } from '@/api/backend/services/user';
import submissionServices from '@/api/backend/services/submission';

import listUtils from '@/utils/listUtils';
import sortingUtils from '@/utils/sortingUtils';
import dateUtils from '@/utils/dateUtils';
import browserUtils from '@/utils/browserUtils';

const TABLE_HEADERS = [
  { title: '', key: 'deployer', align: 'center', sortable: false },
  { title: 'Project Name', key: 'projectName', align: 'center' },
  { title: 'Container Name', key: 'containerName', align: 'center' },
  { title: 'Status', key: 'status', align: 'center', sortable: false },
  { title: 'Passed', key: 'numTestsPassed', align: 'center' },
  { title: 'Total Gas', key: 'totalGas', align: 'center' },
  { title: 'Total Gas Change', key: 'totalGasChange', align: 'center' },
  { title: 'Execution Time (sec)', key: 'executionTimeSeconds', align: 'center' },
  { title: 'Submission Date', key: 'submissionDate', align: 'center' },
  { title: 'Actions', key: 'actions', align: 'center', sortable: false }
];

const props = defineProps({ newSubmission: { type: Object, default: null } });
const emit = defineEmits(['container-output-request', 'submission-edit']);
const store = useStore();

const projects = computed(() => store.state['project'].projects);
const projectNames = computed(() => store.getters['project/successfulProjectNames']);

const submissions = ref(null);
const submissionsList = ref(null);
const submissionViews = ref([]);

const getSubmissionView = ({ _id, project: projectId, testStatus, results, updatedAt, deployer }) => {
  const overallResults = results?.output?.overall;

  return {
    _id,
    projectName: projects.value[projectId] ? projects.value[projectId].projectName : '-',
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
};

const setSubmissions = (val) => {
  submissions.value = listUtils.objectify(val);
  submissionsList.value = val;
  submissionViews.value = val?.map(getSubmissionView) || null;
};

const fetchSubmissions = () => {
  setSubmissions(null);

  Promise.all(projectNames.value.map((projectName) => (
    store.dispatch('handleRequestPromise', {
      request: submissionServices.getAllSubmissions,
      payload: [projectName],
      spinner: false
    })
      .then(addUsers)
  )))
    .then((submissionsList) => {
      const submissionsMerged = listUtils.mergeLists(submissionsList);
      setSubmissions(sortingUtils.sortByDate(submissionsMerged, 'updatedAt'));
    })
    .catch(() => {
      setSubmissions([]);
    });
};

// Watcher: projectNames (store.getters['project/successfulProjectNames'])
watch(
  () => projectNames.value,
  (val) => {
    if (val) {
      fetchSubmissions();
    }
  },
  { immediate: true }
);

// Watcher: props.newSubmission
watch(
  () => props.newSubmission,
  (val) => {
    if (val && submissionsList.value) {
      // Prepend the new submission to the list
      setSubmissions([val, ...submissionsList.value]);
    }
  }
);

const showContainerExecutionOutput = (selectedSubmission) => {
  emit('container-output-request', {
    projectName: selectedSubmission.projectName,
    container: submissions.value[selectedSubmission._id].results
  });
};

const downloadSubmission = (selectedSubmission) => {
  return store.dispatch('handleRequestPromise', {
    request: submissionServices.downloadSubmission,
    payload: [selectedSubmission.projectName, selectedSubmission._id],
    successMessage: `Downloaded the ${selectedSubmission.projectName} submission with ID=${selectedSubmission._id}!`
  }).then((fileResponse) => {
    // Download the file
    browserUtils.downloadFile(`${selectedSubmission.projectName}_submission_${selectedSubmission._id}`, fileResponse);
  }).catch(() => {});
};
</script>

<style scoped>
@import "@/assets/styles/icon.css";
</style>
