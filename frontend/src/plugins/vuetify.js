import 'vuetify/styles';
import '@fortawesome/fontawesome-free/css/all.css';
import '@mdi/font/css/materialdesignicons.css';

import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as dataTableComponents from "vuetify/labs/VDataTable";
import * as directives from 'vuetify/directives';
import { aliases, fa } from 'vuetify/iconsets/fa';
import { mdi } from 'vuetify/iconsets/mdi';

const vuetify = createVuetify({
  components: { ...components, ...dataTableComponents },
  directives,
  theme: {
    defaultTheme: 'theme',
    themes: {
      theme: {
        colors: {
          background: '#F5F5F5',
          surface: '#F5F5F5',
          primary: '#2c3e50',
          secondary: '#FEE996',
          tertiary: '#2F4F4F',
          info: '#2196F3',
          // success: '#4CAF50',
          success: '#42B983',
          warning: '#FB8C00',
          error: '#FF1744'
        }
      }
    }
  },
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: { fa, mdi }
  }
});

export default vuetify;
