<template>
  <v-container>
    <v-footer class="footer">
      <v-row justify="center">
        <v-col class="text-center mt-4" cols="12">
          Copyright {{ new Date().getFullYear() }} — <strong> Batuhan Erden </strong>
        </v-col>
      </v-row>
    </v-footer>
  </v-container>
</template>

<script>
export default {
  name: 'AppFooter'
};
</script>

<style scoped />
