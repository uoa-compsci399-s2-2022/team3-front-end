import { computed } from 'vue';
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import {ElNotification} from 'element-plus'

export const useSendEmailStore = defineStore('sendEmail', () => {
    const processing = ref(false)
    const status = ref('')

    watch(processing, (val) => {
        if (val) {
            ElNotification({
                title: 'Sending Invitation Emails',
                dangerouslyUseHTMLString: true,
                message: 'Please wait...',
                duration: 0,
                type: 'info',
                showClose: false,
            })
        } else {
            ElNotification.closeAll()
            ElNotification({
                title: 'Success',
                message: 'Send Emails Successfully',
                type: 'success',
            })
        }
    })

    return {
        processing,
        status,
    }
})