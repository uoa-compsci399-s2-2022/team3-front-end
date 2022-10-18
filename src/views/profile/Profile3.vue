<script lang="ts" setup>
import { get, post, put } from '@/utils/request';
import { ElMessage, ElNotification, FormInstance } from 'element-plus';
import { reactive, ref, watch } from 'vue'
import { useElementSize } from '@vueuse/core'

type personalInfoType = {
    name: string;
    email: string;
    upi: string;
    auid: string;
    groups: string[];
    degree: string;
    enrolDetails: string;
}
const personalInfo = ref<personalInfoType>({} as personalInfoType)
get(`api/currentUserProfile`).then(res => {
    personalInfo.value.name = res.name;
    personalInfo.value.email = res.email;
    personalInfo.value.upi = res.upi;
    personalInfo.value.auid = res.auid;
    personalInfo.value.groups = res.groups;
    personalInfo.value.degree = res.degree;
    personalInfo.value.enrolDetails = res.enrolDetails;
    console.log(res)
})


// --------------change your personal details------------------------
const fieldsToChange = ref<Array<keyof profileType>>([])

type profileType = {
    name: string;
    email: string;
    upi: string;
    auid: string;
    degree: string;
    enrolDetails: string;
}
const varificationCode = ref<string>("")
const changeProfileDTO = ref<profileType>({} as profileType);
const removeEmptyFields = () => {
    let removeArr = []
    for (let [key, value] of Object.entries(changeProfileDTO.value)) {
        if (value === '') {
            removeArr.push(key)
        }
    }
    removeArr.forEach(v => delete (changeProfileDTO.value as any)[v])
}

watch(changeProfileDTO.value, () => {
    removeEmptyFields()
})

const onSubmit = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            updateProfile()
        } else {
            console.log('error submit!')
            return false
        }
    })
}
const updateProfile = async () => {
    try {
        let res = await post(`/api/validateValidationCode/${changeProfileDTO.value.email}/${varificationCode.value}`)
        console.log(res)
        put('/api/currentUserProfile', { data: changeProfileDTO.value }).then(_ => {
            ElNotification({
                title: 'Success',
                message: 'Your profile has been updated.',
            })
        }).catch(err => {
            ElNotification({
                title: 'Oops. Something went wrong :(',
                message: `${err.response.data.message}`,
                duration: 0,
            })
        })
    } catch (e: any) {
        console.log(e);
        ElNotification({
            title: 'Verification code was wrong :(',
            message: `${e.response.data.message}`,
        })
    }


}

const rules = reactive({
    email: [{ required: true, message: 'Please input email address', trigger: 'blur', }],
    code: [{ required: true, message: 'Please input verification code', trigger: 'blur', }]
})

const UpdateProfileRef = ref<FormInstance>()
// send validation code with a 60s timer
let endTime: Date;
let timeLeft = ref<number>(NaN)
const waiting = ref(false);
const sendCode = async (coolDownTime: number) => {
    if (!await UpdateProfileRef!.value!.validateField('email', () => null)) {
        return;
    }
    endTime = new Date()
    endTime.setTime(endTime.getTime() + coolDownTime * 1000)
    localStorage.setItem('end-time-profile', endTime.getTime().toString())
    timeLeft.value = endTime.getTime() - new Date().getTime()
    waiting.value = true;
    let timer = setInterval(() => {
        timeLeft.value = endTime.getTime() - new Date().getTime()
        if (timeLeft.value <= 0) {
            clearInterval(timer);
            waiting.value = false;
            localStorage.removeItem('end-time-profile')
        }
    }, 1000)
    post("/api/sendValidationEmail", { email: changeProfileDTO.value.email })
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
if (localStorage.getItem('end-time-profile')) {
    endTime = new Date(Number(localStorage.getItem('end-time-profile')))
    timeLeft.value = endTime.getTime() - new Date().getTime()
    if (timeLeft.value > 0) {
        waiting.value = true;
        let timer = setInterval(() => {
            timeLeft.value = endTime.getTime() - new Date().getTime()
            if (timeLeft.value <= 0) {
                clearInterval(timer);
                waiting.value = false;
                localStorage.removeItem('end-time-profile')
            }
        }, 1000)
    }
}

const contentRef = ref<any>(null);
const tabRef = ref<any>(null);

const { height } = useElementSize(contentRef)
watch(height, (_, oldHeight) => {
    if (oldHeight === 0) {
        return
    }
    const el = document.getElementById("qwq") as HTMLElement;
    el.style.height = `${parseInt(el.style.height) + height.value - oldHeight}px`
})
</script>

<template>
    <div class="profile-pane">
        <el-tabs tab-position="left" style="height:450px" class="demo-tabs" id="qwq">
            <el-tab-pane>
                <template #label>
                    <el-icon>
                        <UserFilled />
                    </el-icon>
                </template>

                <div class="content">
                    <h3>Personal info</h3>
                    <h4>name</h4>

                    <div style="display:flex">
                        <p>{{ personalInfo.name }}</p>
                        <div class="groups" v-for="group of personalInfo.groups">
                            <el-tag style="margin-left: 20px;">{{group}}</el-tag>
                        </div>
                    </div>

                    <p v-if="!personalInfo.name">Missing :(</p>

                    <h4>email</h4>
                    <p>{{ personalInfo.email }}</p>
                    <p v-if="!personalInfo.email">Missing :(</p>

                    <h4>upi</h4>
                    <p>{{ personalInfo.upi }}</p>
                    <p v-if="!personalInfo.upi ">Missing :(</p>

                    <h4>auid</h4>
                    <p>{{ personalInfo.auid }}</p>
                    <p v-if="!personalInfo.auid">Missing :(</p>
                    <h4>degree</h4>
                    <p>{{ personalInfo.degree }}</p>
                    <p v-if="!personalInfo.degree">Missing :(</p>
                    <h4>Enrolment detail</h4>
                    <p>{{ personalInfo.enrolDetails }}</p>
                    <p v-if="!personalInfo.enrolDetails">Missing :(</p>
                </div>
            </el-tab-pane>

            <el-tab-pane>
                <template #label>
                    <el-icon>
                        <Message />
                    </el-icon>
                </template>

                <div class="content">
                    <h3>Recent Messages</h3>
                </div>
            </el-tab-pane>

            <el-tab-pane>
                <template #label>
                    <el-icon>
                        <DocumentCopy />
                    </el-icon>
                </template>
                <div class="content">
                    <h3>Documents</h3>
                </div>
            </el-tab-pane>

            <el-tab-pane>
                <template #label>
                    <el-icon>
                        <Setting />
                    </el-icon>
                </template>
                <div class="content" ref="contentRef">
                    <h3>Change your personal details</h3>
                    <el-tooltip class="box-item" effect="light" content="Select fields to update" placement="right">
                        <el-select v-model="fieldsToChange" multiple placeholder="Select fields to update"
                            style="width: 80%">
                            <el-option key="name" label="Name" value="name" />
                            <el-option key="upi" label="UPI" value="upi" />
                            <el-option key="auid" label="AUID" value="auid" />
                            <el-option key="degree" label="Degree" value="degree" />
                            <el-option key="email" label="Email" value="email" />
                            <el-option key="enrolDetails" label="Enrolment detail" value="enrolDetails" />
                        </el-select>
                    </el-tooltip>

                    <el-form :model="changeProfileDTO" status-icon label-position="top" style="width: 80%;"
                        :rules="rules" hide-required-asterisk ref="UpdateProfileRef">
                        <el-form-item prop="name" v-if="fieldsToChange.find(v => v === 'name')">
                            <template #label>
                                <h4>name</h4>
                            </template>
                            <el-input v-model="changeProfileDTO.name" />
                        </el-form-item>

                        <el-form-item prop="email" v-if="fieldsToChange.find(v => v === 'email')">
                            <template #label>
                                <h4>email</h4>
                            </template>
                            <div style="display:flex; column-gap: 20px; width: 100%;">
                                <el-input v-model="changeProfileDTO.email" />
                                <el-button type="info" @click="" plain disabled v-if="waiting" class="verification">
                                    {{(timeLeft / 1000).toFixed(0)}}s
                                </el-button>
                                <el-button type="primary" @click="sendCode(60)" plain v-else class="verification">Send
                                    Code
                                </el-button>
                            </div>


                        </el-form-item>

                        <el-form-item prop="code" v-if="fieldsToChange.find(v => v === 'email')">
                            <h4>verification&nbspcode</h4>
                            <el-input v-model="varificationCode" />
                        </el-form-item>


                        <el-form-item prop="upi" v-if="fieldsToChange.find(v => v === 'upi')">
                            <template #label>
                                <h4>upi</h4>
                            </template>
                            <el-input v-model="changeProfileDTO.upi" />
                        </el-form-item>

                        <el-form-item prop="auid" v-if="fieldsToChange.find(v => v === 'auid')">
                            <template #label>
                                <h4>auid</h4>
                            </template>
                            <el-input v-model.number="changeProfileDTO.auid" />
                        </el-form-item>

                        <el-form-item prop="degree" v-if="fieldsToChange.find(v => v === 'degree')">
                            <template #label>
                                <h4>degree</h4>
                            </template>
                            <el-input v-model="changeProfileDTO.degree" />
                        </el-form-item>

                        <el-form-item prop="enrolDetails" v-if="fieldsToChange.find(v => v === 'enrolDetails')">
                            <template #label>
                                <h4>Enrolment detail</h4>
                            </template>
                            <el-input v-model="changeProfileDTO.enrolDetails" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit(UpdateProfileRef)"
                                v-if="fieldsToChange.length > 0">Submit
                            </el-button>
                        </el-form-item>
                    </el-form>
                    {{changeProfileDTO}}
                    {{fieldsToChange}}
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>

</template>


<style>
.el-tabs__content {
    height: 100%;
    overflow: visible;
}
</style>
<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css?family=Nunito:400,900|Montserrat|Roboto');


$logo: #3DBB3D;
$gray: #777777;
$black: #070707;
$green: #7ED386;
$aqua: #3FB6A8;
$white: #FFFFFF;

$hulu: 'Nunito Sans', sans-serif;
$heading: 'Montserrat', sans-serif;
$body: 'Roboto', sans-serif;
$primary: #64bee8;


.profile-pane {
    position: relative;
    margin-top: 50px;
    width: 100%;

    .el-tabs {
        margin-left: 10vw;
    }

    .el-tabs--left {
        overflow: visible;
    }


    .el-tab-pane {
        position: relative;
        width: 100%;
        height: 100%;

        .content {
            background-color: rgb(255, 255, 255);
            position: relative;
            width: 600px;
            min-height: 350px;
            left: -30px;
            top: 40px;
            box-shadow: var(--el-box-shadow-light);
            padding-left: 120px;

            h3 {
                font-family: $heading;
                font-size: 20px;
                color: $primary;
                margin-top: 20px;
                margin-bottom: 20px;
            }

            h4 {
                font-family: $body;
                color: $gray;
                width: 80%;
                text-transform: uppercase;
                font-size: 10px;
                letter-spacing: 1px;
                margin-left: 2px;
            }
        }
    }
}

.el-icon {
    width: 50px;
    font-size: 20px;
    transition: all .3s ease-in-out;
}

:deep(.el-tabs__nav-wrap.is-left) {
    box-shadow: 3px 3px 10px rgba(119, 119, 119, 0.5);
}


:deep(.el-tabs__header.is-left) {
    z-index: 10;
}

::v-deep .el-tabs__nav-scroll {
    background-color: $primary;
    padding: 30px 0;
}


::v-deep .el-tabs__nav {
    margin: 0 2px;
    /* 使用rpx没有效果 */
}

::v-deep .el-tabs__item.is-left {
    padding: 50px 10px;
    display: flex;
    justify-content: center;
    align-items: center;
}

// ::v-deep .el-tabs--left .el-tabs__item.is-left:nth-child(2) {
//   padding-left: 10px;
// }
// ::v-deep .el-tabs--top .el-tabs__item.is-top:last-child {
//   padding-right: 120px;
// }
// /*悬浮样式*/
:deep(.el-tabs__item:hover) {
    color: #06487f;

    .el-icon {
        font-size: 25px;
        transition: all .3s ease-in-out;
    }
}


:deep(.el-tabs__item) {
    color: #fff;
}


:deep(.el-tabs__item.is-active) {
    color: #06487f;

    .el-icon {
        font-size: 25px;
    }
}

// /*选中样式*/
// ::v-deep .el-tabs__item.is-active {
//   color: #fff;
//   font-weight: bold;
//   background-color: #e1251b;
// }
/*隐藏tab下面的一横*/
::v-deep .el-tabs__active-bar {
    display: none;
}
</style>
  