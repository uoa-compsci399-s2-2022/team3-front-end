import { defineStore } from 'pinia';

export const useSidebarStore = defineStore('sidebar', {
    state: () => ({
        collapse: true
    }),

    actions: {
        handleCollase() {
            this.collapse = !this.collapse;
        }
    }
})