<template>
  <v-container>
    <div>
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
    </div>
    <v-container />
  </v-container>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'AuthForm',
  props: {
    actionText: { type: String, default: null },
    actionFunctionName: { type: String, default: null }
  },
  setup: (props) => {
    const router = useRouter();
    const store = useStore();

    const email = ref('');
    const emailError = ref(null);
    const password = ref('');
    const passwordError = ref(null);

    return {
      email,
      emailError,
      password,
      passwordError,
      authenticatedUser: computed(() => store.state['user'].authenticatedUser),
      submitForm: () => {
        store.dispatch(`user/${props.actionFunctionName}`, { email: email.value, password: password.value })
          .then(() => {
            router.push({ path: '/' });
          })
          .catch(({ data }) => {
            if (!data || !data.error) return;

            const emailErrorMatch = data.error.reason.match(/email: (.+?)(?:\.|$)/i);
            const passwordErrorMatch = data.error.reason.match(/password: (.+?)(?:\.|$)/i);

            emailError.value = emailErrorMatch ? emailErrorMatch[1] : null;
            passwordError.value = passwordErrorMatch ? passwordErrorMatch[1] : null;
          });
      }
    };
  }
};
</script>

<style scoped>
form {
  width: 20em;
  margin: 0 auto;
  padding: 30px;
  box-shadow: 1px 2px 3px rgba(0,0,0,0.1);
  border-radius: 10px;
  background: white;
}

form h2 {
  font-size: 2.4em;
  margin-bottom: 40px;
}

form input {
  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 1em;
  width: 100%;
}

form label {
  display: block;
  margin: 20px 0 10px;
}

button {
  margin-top: 2em;
}

p.error {
  margin: 10px 2px;
  font-size: 0.8em;
}
</style>
