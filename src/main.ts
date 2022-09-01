import { createApp, ref } from 'vue'
import './styles/default.scss'
import App from './App.vue'
import router from '@/router/index'
import pinia from '@/store/index'

const app = createApp(App);

app.use(router)
app.use(pinia)
app.mount('#app')
