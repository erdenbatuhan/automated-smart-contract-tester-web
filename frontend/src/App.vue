<template>
  <v-app>
    <!-- Navbar-->
    <v-container>
      <app-navbar />
    </v-container>

    <!-- Router View-->
    <v-container>
      <app-alert />
      <router-view />
    </v-container>

    <!-- Footer-->
    <v-container>
      <app-footer />
    </v-container>
  </v-app>
</template>

<script>
import AppNavbar from '@/components/AppNavbar.vue';
import AppFooter from "@/components/AppFooter.vue";
import AppAlert from "@/components/AppAlert.vue";

export default {
  name: 'App',
  components: {
    AppNavbar,
    AppFooter,
    AppAlert
  },
  setup: () => {
    return {};
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');

body {
  text-align: center;
  font-size: 1.2rem;
  letter-spacing: 1px;
  background: #F5F5F5;
}

h1, h2, h3, h4, ul, li, a, p, input, label, button, div, footer {
  font-family: 'Quicksand', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

ul {
  list-style-type: none;
}

a {
  text-decoration: none;
}
</style>
