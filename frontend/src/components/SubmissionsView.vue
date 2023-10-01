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
import { defineProps, defineEmits, ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';

import DataView from '@/components/data-view/DataView.vue';

import { addDeployerEmailsToData } from '@/api/backend/services/user';
import submissionServices from '@/api/backend/services/submission';

import sortingUtils from '@/utils/sortingUtils';
import listUtils from '@/utils/listUtils';
import dateUtils from '@/utils/dateUtils';
import browserUtils from '@/utils/browserUtils';

const TABLE_HEADERS = [
  { title: '', key: 'deployer', align: 'center', sortable: false },
  { title: 'Submission Name', key: 'submissionName', align: 'center' },
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

const props = defineProps({ lastUpdatedSubmission: { type: Object, default: null } });
const emit = defineEmits(['container-output-request', 'submission-edit']);
const store = useStore();

const submissions = ref([]);
const submissionViews = computed(() => (
  submissions?.value?.map(({ _id: id, submissionName, testStatus, results, createdAt, updatedAt, deployer }) => {
    const container = results?.container;
    const overallResults = container?.output?.overall;
    const dockerImage = results?.dockerImage;

    return {
      id,
      submissionName,
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
    container: submissions.value[submissionIndex].results?.container
  });
};

const downloadSubmission = (selectedSubmission) => {
  return store.dispatch('handleRequestPromise', {
    requestPromise: submissionServices.downloadSubmission(selectedSubmission.submissionName),
    successMessage: `Successfully downloaded the ${selectedSubmission.submissionName} submission!`
  }).then((fileResponse) => {
    // Download the file
    browserUtils.downloadFile(selectedSubmission.submissionName, fileResponse);
  }).catch(() => {});
};

const fetchSubmissions = () => {
  submissions.value = [];

  store.dispatch('handleRequestPromise', {
    requestPromise: submissionServices.getAllSubmissions(),
    spinner: false
  })
    .then(addDeployerEmailsToData)
    .then((submissionsRetrieved) => {
      submissions.value = sortingUtils.sortByDate(submissionsRetrieved, 'updatedAt');
    })
    .catch(() => {});
};

onMounted(() => {
  fetchSubmissions();
});
</script>

<style scoped>
@import "@/assets/styles/icon.css";
</style>
