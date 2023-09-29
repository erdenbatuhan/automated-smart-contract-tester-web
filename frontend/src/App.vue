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
import AppNavbar from '@/components/AppNavbar.vue';
import AppFooter from '@/components/AppFooter.vue';
import AppAlert from '@/components/AppAlert.vue';
import AppSpinner from '@/components/AppSpinner.vue';
</script>

<style>
@import '@/assets/styles/main.css';
</style>
