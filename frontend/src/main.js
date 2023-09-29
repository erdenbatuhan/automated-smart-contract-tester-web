import { createApp } from 'vue';

import router from '@/router';
import store from '@/store';
import vuetify from '@/plugins/vuetify';

import App from '@/App.vue';

createApp(App)
  .use(router)
  .use(store)
  .use(vuetify)
  .mount('#app');
