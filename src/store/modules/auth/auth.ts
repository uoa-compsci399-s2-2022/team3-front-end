import { defineStore } from 'pinia'
import { ref } from 'vue'




export const useUserStore = defineStore('user', () => {

    const userId = ref<string>("");
    const token = ref<string>("");


    const setToken = (t: string) => {
        token.value = t;
        localStorage.setItem("mtms_token", t);
    }

    const setUserId = (t: string) => {
        userId.value = t;
        localStorage.setItem("userID", t);
    }

    const clearToken = () => {
        token.value = "";
        localStorage.removeItem("mtms_token");
    }
    return {
        // state
        userId,
        // getters
        
        // actions
        setToken,
        clearToken,
        setUserId
    }
})