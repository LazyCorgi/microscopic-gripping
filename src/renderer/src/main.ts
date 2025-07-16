import './assets/main.css'
import 'vuetify/styles' // 样式必须引入
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { createApp } from 'vue'
import App from './App.vue'

const vuetify = createVuetify({
  components,
  directives
})

const app = createApp(App)
app.use(vuetify)
app.mount('#app')
