import { defineStore } from 'pinia';
import {ref} from 'vue';
import {isMobile} from '@/utils/isMoblie'

export const useSidebarStore = defineStore('sidebar', {
    state: () => ({
        collapse: true,
        display: ref(true),
    }),

    actions: {
        handleCollase() {
            this.collapse = !this.collapse;
            if (isMobile() && this.collapse) {
                this.display = false;
            }else if (isMobile() && !this.collapse) {
                this.display = true;
            }
        }
    }
})