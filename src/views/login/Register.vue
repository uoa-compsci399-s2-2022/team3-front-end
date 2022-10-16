<script setup lang="ts">
import LoginBackground from '@/components/backgrounds/LoginBackground.vue'
import { onBeforeMount, reactive, ref } from 'vue';
import { get, post } from '@/utils/request'
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance } from 'element-plus'


const registerFormRef = ref<FormInstance>()

const getSetting = () => {
    get('api/setting').then((res) => {
        if (!res.allowRegister) {
            router.push('/login')
        }
    }).catch((e) => {
        ElMessage({
            message: e.response.data['message'],
            type: 'error'
        })
    })
}

onBeforeMount(() => {
    getSetting()
})


const validatePass = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('Please input the password'))
    } else {
        if (registerForm.repeatPassword !== '') {
            if (!registerFormRef.value) return
            registerFormRef.value.validateField('rep    eatPassword', () => null)
        }
        callback()
    }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('Please input the password again'))
    } else if (value !== registerForm.password) {
        callback(new Error("Two inputs don't match!"))
    } else {
        callback()
    }
}

const registerForm = reactive({
    userID: '',
    password: '',
    repeatPassword: '',
    email: '',
    name: '',
    code: '',
})


const rules = reactive({
    userID: [{ required: true, message: 'Please input userID', trigger: 'blur', }],
    password: [{ validator: validatePass, trigger: 'blur' }],
    repeatPassword: [{ validator: validatePass2, trigger: 'blur' }],
    email: [{ required: true, message: 'Please input email address', trigger: 'blur', }],
    name: [{ required: true, message: 'Please input your name', trigger: 'blur', }],
    code: [{ required: true, message: 'Please input validation code', trigger: 'blur', }]
})


const router = useRouter()
// register
const register = () => {
    post("/api/registerUser", registerForm)
        .then(res => {
            ElMessage({
                message: `Register success.`,
                type: 'success',
            })
        }).then(() => {
            router.push('/login')
        })
        .catch(
            err => {

                ElMessage({
                    message: `${err.response.data.message}`,
                    type: 'error',
                })
            }
        )
}

// send validation code with a 60s timer
let endTime: Date;
let timeLeft = ref<number>(NaN)
const waiting = ref(false);
const sendCode = async (coolDownTime: number) => {
    if (!await registerFormRef!.value!.validateField('email', () => null)) {
        return;
    }
    endTime = new Date()
    endTime.setTime(endTime.getTime() + coolDownTime * 1000)
    localStorage.setItem('end_time', endTime.getTime().toString())
    timeLeft.value = endTime.getTime() - new Date().getTime()
    waiting.value = true;
    let timer = setInterval(() => {
        timeLeft.value = endTime.getTime() - new Date().getTime()
        if (timeLeft.value <= 0) {
            clearInterval(timer);
            waiting.value = false;
            localStorage.removeItem('end_time')
        }
    }, 1000)
    post("/api/sendValidationEmail", { email: registerForm.email })
        .then(res => {
            ElMessage({
                message: `Validation code email has been sent to your email.`,
                type: 'success',
            })
        }).catch(
            err => {
                ElMessage({
                    message: `${err.response.data.message}`,
                    type: 'error',
                })
            }
        )
}


// 防止用户刷新后timer重置
if (localStorage.getItem('end_time')) {
    endTime = new Date(Number(localStorage.getItem('end_time')))
    timeLeft.value = endTime.getTime() - new Date().getTime()
    if (timeLeft.value > 0) {
        waiting.value = true;
        let timer = setInterval(() => {
            timeLeft.value = endTime.getTime() - new Date().getTime()
            if (timeLeft.value <= 0) {
                clearInterval(timer);
                waiting.value = false;
                localStorage.removeItem('end_time')
            }
        }, 1000)
    }
}

const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            console.log('submit!')
            register();
        } else {
            console.log('error submit!')
            return false
        }
    })
}


</script>
    
<template>
    <LoginBackground />
    <div class="container">
        <div class="register-window">
            <h1>Register</h1>
            <img src="@/assets/logo/uoa.svg" alt="" class="logo">
            <el-form ref="registerFormRef" :model="registerForm" status-icon :rules="rules" label-width="150px"
                class="demo-registerForm" hide-required-asterisk>
                <el-form-item label="UserID" prop="userID">
                    <el-input v-model="registerForm.userID" type="text" />
                </el-form-item>
                <el-form-item label="Password" prop="password">
                    <el-input v-model="registerForm.password" type="password" />
                </el-form-item>
                <el-form-item label="Confirm" prop="repeatPassword">
                    <el-input v-model="registerForm.repeatPassword" type="password" />
                </el-form-item>

                <el-form-item label="Name" prop="name">
                    <el-input v-model="registerForm.name" type="text" />
                </el-form-item>
                <div style="display:flex; column-gap: 20px;">
                    <el-form-item label="Email" prop="email">
                        <el-input v-model="registerForm.email" type="text" />
                    </el-form-item>
                    <el-button type="info" @click="" plain disabled v-if="waiting" class="verification">
                        <el-icon>
                            <Timer />
                        </el-icon>After {{(timeLeft / 1000).toFixed(0)}}s to resend
                    </el-button>
                    <el-button type="primary" @click="sendCode(60)" plain v-else class="verification">Send Code
                    </el-button>
                </div>
                <el-form-item label="Verification Code" prop="code">
                    <el-input v-model="registerForm.code" type="text" />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm(registerFormRef)" style="width:100%;">Submit
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
    
<style scoped lang="scss">
.container {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: flex-end;
    align-items: center;
}

.register-window {
    margin-right: 20vw;
    margin-top: 100px;
    display: flex;
    flex-direction: column;
    justify-self: center;
    align-items: center;
    width: 550px;

    h1 {
        transform: translateX(60px);
        font-size: 28.83px;
        font-weight: 600;
        letter-spacing: 0px;
        margin: 20px 0;
        /* Primary */
        color: #003867;
    }

    img {
        position: absolute;
        width: 160px;
        height: 160px;
        left: 0;
        top: 0;
    }

}

@media only screen and (max-width: 770px) {

    // ipad mini 768 * 1024
    .container {
        justify-content: center;

        .register-window {
            margin-right: 0;
            margin-top: 10vw;

            img {
                position: static;
                width: 40vw;
                height: 40vw;
            }
        }
    }
}

.verification {
    width: 150px;
}
</style>