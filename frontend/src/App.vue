<template>
  <v-app>
    <!-- Navbar-->
    <v-container>
      <app-navbar />
    </v-container>

    <!-- Router View-->
    <v-container>
      <app-alert />
      <app-spinner />

      <router-view />
    </v-container>

    <!-- Footer-->
    <v-container>
      <app-footer />
    </v-container>
  </v-app>
</template>

<script setup>
import { onMounted } from 'vue';
import { useStore } from 'vuex';

import AppNavbar from '@/components/app/AppNavbar.vue';
import AppFooter from '@/components/app/AppFooter.vue';
import AppAlert from '@/components/app/AppAlert.vue';
import AppSpinner from '@/components/app/AppSpinner.vue';

const store = useStore();

onMounted(() => {
  store.dispatch('project/fetchProjects', { spinner: true });
  store.dispatch('project/fetchAvailableTestExecutionArguments');
});
</script>

<style>
@import '@/assets/styles/main.css';
</style>
