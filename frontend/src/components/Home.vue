<template>
  <div>
    <v-card>
      <v-tabs v-model="tab" centered>
        <div
          v-for="([tabName, { title, icon, isVisible, onlyVisibleWhenSelected }]) in Object.entries(tabs)"
          :key="tabName"
        >
          <v-tab
            v-show="isVisible() && (!onlyVisibleWhenSelected || tab === tabName)"
            class="tab"
            :value="tabName"
          >
            {{ title }}
            <i :class="icon" aria-hidden="true" />
          </v-tab>
        </div>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item
          v-for="tabName in Object.keys(tabs)"
          :key="tabName"
          :value="tabName"
        >
          <ProjectView
            v-if="tabName === 'tab-all_projects'"
            @project-edit="onProjectEdit"
            @container-output-request="onContainerOutputRequest"
          />

          <ProjectUpload
            v-else-if="tabName === 'tab-project_upload'"
            :project-edited="projectBeingEdited"
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
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';

import ProjectView from '@/components/ProjectView.vue';
import ProjectUpload from '@/components/project-update/ProjectUpload.vue';
import ContainerOutputView from '@/components/container-output/ContainerOutputView.vue';

const tabs = ref({
  'tab-all_projects': {
    title: 'All Projects',
    icon: 'fa fa-book',
    isVisible: () => isLoggedIn.value
  },
  'tab-project_upload': {
    title: 'Project Upload',
    icon: 'fa fa-cloud-upload',
    isVisible: () => isAdmin.value,
    resetFunction: () => {
      projectBeingEdited.value = null;
    }
  },
  'tab-all_submissions': {
    title: 'All Submissions',
    icon: 'fa fa-code',
    isVisible: () => isLoggedIn.value
  },
  'tab-submission_upload': {
    title: 'Submission Upload',
    icon: 'fa fa-upload',
    isVisible: () => isLoggedIn.value
  },
  'tab-container_output': {
    title: 'Container Output',
    icon: 'fa fa-bar-chart',
    isVisible: () => isLoggedIn.value,
    onlyVisibleWhenSelected: true,
    resetFunction: () => {
      containerExecutionOutputPayload.value = null;
    }
  }
});

const store = useStore();

const isLoggedIn = computed(() => store.getters['user/isLoggedIn']);
const isAdmin = computed(() => store.getters['user/isLoggedInAsAdmin']);

const tab = ref(null);
const projectBeingEdited = ref(null);
const containerExecutionOutputPayload = ref(null);

const onProjectEdit = ({ project }) => {
  projectBeingEdited.value = project;
  tab.value = 'tab-project_upload';
};

const onContainerOutputRequest = ({ projectName, config, container }) => {
  containerExecutionOutputPayload.value = { projectName, config, container };
  tab.value = 'tab-container_output';
};

const onProjectUpdate = () => {
  tab.value = 'tab-all_projects';
};

watch(
  () => tab.value,
  (newTab, oldTab) => {
    if (oldTab && tabs.value[oldTab].resetFunction) {
      tabs.value[oldTab].resetFunction();
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
