import { createPinia } from "pinia";
import { useUserStore } from './modules/auth/auth'
import { usePermissionStore } from './modules/permission/permission'
import { useSidebarStore } from "./modules/sidebar/sidebar";
// create pinia instance
const pinia = createPinia();


export { useUserStore, usePermissionStore, useSidebarStore };
export default pinia;