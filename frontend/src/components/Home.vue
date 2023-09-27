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
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item value="tab-all_projects">
          <ProjectView />
        </v-window-item>

        <v-window-item value="tab-project_upload">
          <ProjectUpload />
        </v-window-item>
      </v-window>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';

import ProjectView from '@/components/ProjectView.vue';
import ProjectUpload from '@/components/ProjectUpload.vue';

const tab = ref(null);
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
