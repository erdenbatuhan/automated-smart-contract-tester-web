<template>
  <nav>
    <h2><a href="/"> Automated Smart Contract Tester </a></h2>

    <ul v-if="authenticatedUser">
      <li>
        <p class="text-subtitle-2">
          <strong>Logged in as:</strong> {{ authenticatedUser.email }}
        </p>
      </li>

      <li><a @click="logout"> Log out </a></li>
    </ul>

    <ul v-else>
      <li>
        <router-link to="/login">
          Log in
        </router-link>
      </li>

      <li>
        <router-link to="/signup">
          Sign up
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore();
const router = useRouter();

const authenticatedUser = computed(() => store.state['user'].authenticatedUser);

const logout = () => store.dispatch('user/logout').finally(() => { router.push({ path: '/login' }); });
</script>

<style scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin: 1em 0;
}

nav ul {
  display: flex;
  align-items: center;
}

nav li {
  margin-left: 20px;
}

nav li a {
  text-transform: uppercase;
  font-weight: 700;
  font-size: 0.8em;
  border-radius: 30px;
  display: block;
  padding: 10px 16px;
  letter-spacing: 2px;
  cursor: pointer;
  text-decoration: none;
  transition: box-shadow 0.3s ease;
}

nav li a:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transform: translateY(-.5px);
}

nav li a:active {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  transform: translateY(0);
}
</style>
