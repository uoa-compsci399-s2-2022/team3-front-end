import {ElNotification} from "element-plus";

export function warningNotification (message : string) {
    ElNotification({
        title: 'Warning',
        message: message,
        type: 'warning',
    })
}

export function errorNotification  (message : string)  {
    ElNotification({
        title: 'Error',
        message: message,
        type: 'error',
        position:'bottom-right'
    })
}

export function normalNotification(title: string,  message : string){
    ElNotification({
        title: title,
        message: message,
    })
}

export function successNotification(message : string) {
    ElNotification({
        title: 'Success',
        message: message,
        type: 'success',
    })
}


