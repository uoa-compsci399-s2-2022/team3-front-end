import { createApp } from 'vue'
import './styles/default.scss'
import App from './App.vue'
import router from '@/router/index'
import pinia, { usePermissionStore } from '@/store/index'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUserSecret, faCloudArrowUp, faFileCircleQuestion, faChalkboardUser, faFileCircleCheck, faBookOpenReader, faGraduationCap, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
// import {  } from '@fortawesome/free-regular-svg-icons'

const app = createApp(App);
app.use(router)
app.use(pinia)
app.use(ElementPlus)
app.use(VXETable)
const permission = usePermissionStore()

// register element-plus icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}


// register fontawesome icons
library.add(faUserSecret, faTwitter, faCloudArrowUp, faFileCircleQuestion, faChalkboardUser, faFileCircleCheck, faBookOpenReader, faGraduationCap, faTriangleExclamation)
app.component('font-awesome-icon', FontAwesomeIcon)

// customized directive v-permission, if v-permmission not in the whiteList, then hide that element
app.directive('permission', {
    mounted(el, binding) {
        if (!Array.from(permission.key).includes(String(binding.value))) {
            el['hidden'] = true
        }
    }
})





app.mount('#app')