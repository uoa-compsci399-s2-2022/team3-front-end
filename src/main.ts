import { createApp } from 'vue'
import './styles/default.scss'
import App from './App.vue'
import router from '@/router/index'
import pinia, { usePermissionStore } from '@/store/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App);
app.use(router)
app.use(pinia)
app.use(ElementPlus)
const permission = usePermissionStore()

// register element-plus icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
// customized directive v-permission, if v-permmission not in the whiteList, then hide that element
app.directive('permission', {
    mounted(el, binding) {
        if (!Array.from(permission.key).includes(String(binding.value))) {
            el['hidden'] = true
        }
    }
})
app.mount('#app')
