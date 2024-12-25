import { createApp } from 'vue'
import './styles/index.scss';
import 'virtual:uno.css'
import '@varlet/touch-emulator'

import App from './App.vue'

// theme
import { setGlobalTheme } from '@/theme/themeStyleProvider'
setGlobalTheme('light')

// store
import { setupStore } from '@/store'

// router
import router from "@/router/index";

const app = createApp(App)
setupStore(app)
app.use(router)
app.mount('#app')