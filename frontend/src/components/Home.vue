<template>
  <div>
    <v-card>
      <v-tabs v-model="tab" centered>
        <v-tab class="tab" value="tab-all_projects">
          All Projects
          <i class="fa fa-book" aria-hidden="true" />
        </v-tab>

        <v-tab class="tab" value="tab-project_upload">
          Project Upload
          <i class="fa fa-upload" aria-hidden="true" />
        </v-tab>

        <v-tab v-show="tab === 'tab-container_output'" class="tab" value="tab-container_output">
          Container Output
          <i class="fa fa-upload" aria-hidden="true" />
        </v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item value="tab-all_projects">
          <ProjectView :last-uploaded-project="lastUploadedProject" @container-output-request="onContainerOutputRequest" />
        </v-window-item>

        <v-window-item v-if="tab === 'tab-project_upload'" value="tab-project_upload">
          <ProjectUpload @project-uploaded="onProjectUploaded" />
        </v-window-item>

        <v-window-item v-if="tab === 'tab-container_output'" value="tab-container_output">
          <ContainerOutputView
            :project-name="containerExecutionOutputViewed?.projectName"
            :container-execution-output="containerExecutionOutputViewed?.container"
          />
        </v-window-item>
      </v-window>
    </v-card>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';

import ProjectView from '@/components/ProjectView.vue';
import ProjectUpload from '@/components/ProjectUpload.vue';
import ContainerOutputView from '@/components/container-output/ContainerOutputView.vue';

const tab = ref(null);
const containerExecutionOutputViewed = ref(null);
const lastUploadedProject = ref(null);

const onContainerOutputRequest = ({ projectName, container }) => {
  containerExecutionOutputViewed.value = { projectName, container };
  tab.value = 'tab-container_output';
};

const onProjectUploaded = (projectUploadResponse) => {
  lastUploadedProject.value = projectUploadResponse['project'];
  tab.value = null;
};

watchEffect(() => {
  if (tab.value !== 'tab-container_output') {
    containerExecutionOutputViewed.value = null;
  }
});
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.tab .fa {
  margin-left: 5px;
}
</style>
