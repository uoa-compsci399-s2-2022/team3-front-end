import { computed } from 'vue';
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import {ElNotification} from 'element-plus'

export const useSendEmailStore = defineStore('sendEmail', () => {
    const status = ref('')
    const currentNotification = ref();

    watch(status, (val) => {
        if (val === 'processing') {
            currentNotification.value = ElNotification({
                title: 'Sending Invitation Emails',
                dangerouslyUseHTMLString: true,
                message: 'Please wait...',
                duration: 0,
                type: 'info',
                showClose: false,
            })
        } else if (val === 'success') {
            currentNotification.value.close()
            ElNotification({
                title: 'Success',
                message: 'Send Emails Successfully',
                type: 'success',
            })
            status.value = ''
        } else if (val === 'error') {
            ElNotification.closeAll()
            setTimeout(() => {
                ElNotification({
                    title: 'Error',
                    message: 'Send Emails Failed',
                    type: 'error',
                })
            }, 10)
            status.value = ''
        }
    })

    return {
        status,
    }
})