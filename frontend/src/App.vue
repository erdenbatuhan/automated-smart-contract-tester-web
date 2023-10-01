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
import AppNavbar from '@/components/app/AppNavbar.vue';
import AppFooter from '@/components/app/AppFooter.vue';
import AppAlert from '@/components/app/AppAlert.vue';
import AppSpinner from '@/components/app/AppSpinner.vue';
</script>

<style>
@import '@/assets/styles/main.css';
</style>
