<template>
  <div>
    <v-card>
      <v-tabs v-model="tab" centered>
        <v-tab
          v-for="([tabName, { title, icon, onlyVisibleWhenSelected }]) in Object.entries(TABS)"
          v-show="!onlyVisibleWhenSelected || tab === tabName"
          :key="tabName"
          class="tab"
          :value="tabName"
        >
          {{ title }}
          <i :class="icon" aria-hidden="true" />
        </v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item
          v-for="tabName in Object.keys(TABS)"
          :key="tabName"
          :value="tabName"
        >
          <ProjectView
            v-if="tabName === 'tab-all_projects'"
            :last-updated-project="lastUpdatedProject"
            @project-edit="onProjectEdit"
            @container-output-request="onContainerOutputRequest"
          />

          <ProjectUpload
            v-else-if="tabName === 'tab-project_upload'"
            :project-edited="projectEdited"
            @project-upload="onProjectUpdate"
          />

          <ContainerOutputView
            v-else-if="tabName === 'tab-container_output'"
            :project="containerExecutionOutputPayload"
            @project-config-update="onProjectUpdate"
          />
        </v-window-item>
      </v-window>
    </v-card>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

import ProjectView from '@/components/ProjectView.vue';
import ProjectUpload from '@/components/project-update/ProjectUpload.vue';
import ContainerOutputView from '@/components/container-output/ContainerOutputView.vue';

const TABS = {
  ['tab-all_projects']: {
    title: 'All Projects',
    icon: 'fa fa-book'
  },
  ['tab-project_upload']: {
    title: 'Project Upload',
    icon: 'fa fa-upload',
    resetFunction: () => {
      projectEdited.value = null;
    }
  },
  ['tab-container_output']: {
    title: 'Container Output',
    icon: 'fa fa-bar-chart',
    onlyVisibleWhenSelected: true,
    resetFunction: () => {
      containerExecutionOutputPayload.value = null;
    }
  }
};

const tab = ref(null);
const projectEdited = ref(null);
const containerExecutionOutputPayload = ref(null);
const lastUpdatedProject = ref(null);

const onProjectEdit = ({ project }) => {
  projectEdited.value = project;
  tab.value = 'tab-project_upload';
};

const onContainerOutputRequest = ({ projectName, config, container }) => {
  containerExecutionOutputPayload.value = { projectName, config, container };
  tab.value = 'tab-container_output';
};

const onProjectUpdate = ({ project }) => {
  lastUpdatedProject.value = project;
  tab.value = 'tab-all_projects';
};

watch(
  () => tab.value,
  (newTab, oldTab) => {
    if (oldTab && TABS[oldTab].resetFunction) {
      TABS[oldTab].resetFunction();
    }
  }
);
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
