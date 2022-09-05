import { createPinia } from "pinia";
import { useUserStore } from './modules/auth/auth'
import { usePermissionStore } from './modules/permission/permission'

// create pinia instance
const pinia = createPinia();


export { useUserStore, usePermissionStore };
export default pinia;