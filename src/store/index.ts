import { def } from "@vue/shared";
import { createPinia } from "pinia";
import { useUserStore } from './modules/auth/auth'

// create pinia instance
const pinia = createPinia();


export { useUserStore };
export default pinia;