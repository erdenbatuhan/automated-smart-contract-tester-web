<template>
  <form @submit.prevent="submitForm">
    <h2 class="font-weight-black">
      {{ actionText }}
    </h2>

    <label for="email"> Email </label>
    <input v-model="email" type="text" name="email" required>
    <p class="error font-weight-bold text-error">
      {{ emailError }}
    </p>

    <label for="password"> Password </label>
    <input v-model="password" type="password" name="password" required>
    <p class="error font-weight-bold text-error">
      {{ passwordError }}
    </p>

    <v-btn type="submit" color="secondary" size="large" rounded="xl">
      <p class="font-weight-black">
        {{ actionText }}
      </p>
    </v-btn>
  </form>
</template>

<script setup>
import { ref, defineProps } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const props = defineProps({
  actionText: { type: String, default: null },
  actionFunctionName: { type: String, default: null }
});

const router = useRouter();
const store = useStore();

const email = ref('');
const emailError = ref(null);
const password = ref('');
const passwordError = ref(null);

const submitForm = () => {
  store.dispatch(`user/${props.actionFunctionName}`, { email: email.value, password: password.value })
  .then(() => (
    router.push({ path: '/' })
  ))
  .catch(({ data }) => {
    const emailErrorMatch = data?.error?.reason?.match(/email: (.+?)(?:\.|$)/i);
    const passwordErrorMatch = data?.error?.reason?.match(/password: (.+?)(?:\.|$)/i);

    emailError.value = emailErrorMatch ? emailErrorMatch[1] : null;
    passwordError.value = passwordErrorMatch ? passwordErrorMatch[1] : null;
  });
};
</script>

<style scoped>
@import "@/assets/styles/form.css";
</style>
