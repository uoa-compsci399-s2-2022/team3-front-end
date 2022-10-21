<script lang="ts" setup>
import { get, post, put } from '@/utils/request';
import { ElMessage, ElNotification, FormInstance, genFileId, UploadInstance, UploadProps, UploadRawFile, UploadUserFile } from 'element-plus';
import { reactive, ref, watch } from 'vue'
import { useElementSize } from '@vueuse/core'
import { errorNotification, successNotification, warningNotification } from '@/utils/notification';
import { base64ToBlob } from '@/utils/base64ToBlob';
import { useWindowSize } from '@vueuse/core'
import { View } from '@element-plus/icons-vue'



const { width: windoWidth } = useWindowSize()
const tabPosition = ref<"top" | "left" | "right" | "bottom">((windoWidth.value < 800) ? "top" : "left")
watch(windoWidth, () => {
    if (windoWidth.value < 800) {
        tabPosition.value = "top"
    } else {
        tabPosition.value = "left"
    }
})
const currentTab = ref("0")

type personalInfoType = {
    id: string;
    name: string;
    email: string;
    upi: string;
    auid: string;
    groups: string[];
    degree: string;
    enrolDetails: string;
}
const personalInfo = ref<personalInfoType>({} as personalInfoType)
const getUserProfile = () => {
    get(`api/currentUserProfile`).then(res => {
        personalInfo.value.id = res.id
        personalInfo.value.name = res.name;
        personalInfo.value.email = res.email;
        personalInfo.value.upi = res.upi;
        personalInfo.value.auid = res.auid;
        personalInfo.value.groups = res.groups;
        personalInfo.value.degree = res.degree;
        personalInfo.value.enrolDetails = res.enrolDetails;

    })
}
getUserProfile()


// --------------change your personal details------------------------
const fieldsToChange = ref<Array<keyof profileType>>([])

type profileType = {
    name: string;
    email: string;
    upi: string;
    auid: string;
    degree: string;
    enrolDetails: string;
    code: string;
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
    if (!formEl) return;
    if (fieldsToChange.value.find(v => v === 'email')) {
        formEl.validate(async (valid) => {
            if (valid) {
                try {
                    let res = await post(`/api/validateValidationCode/${changeProfileDTO.value.email}/${changeProfileDTO.value.code}`)
                    updateProfile()
                } catch (e: any) {
                    ElNotification({
                        title: 'Error :(',
                        type: 'error',
                        message: `${e.response.data.message}`,
                    })
                }
            } else {
                console.log('error submit!')
                return false
            }
        })
    } else {
        updateProfile()
    }

}
const updateProfile = async () => {

    put('/api/currentUserProfile', { data: changeProfileDTO.value }).then(_ => {
        ElNotification({
            title: 'Success',
            message: 'Your profile has been updated.',
            type: 'success',
        })
        getUserProfile()
        setTimeout(() => { currentTab.value = "0" });
        fieldsToChange.value.length = 0;
    }).catch(err => {
        ElNotification({
            title: 'Oops. Something went wrong :(',
            message: `${err.response.data.message}`,
            type: 'error',
            duration: 0,
        })
    })

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
const { height } = useElementSize(contentRef)
watch(height, () => {
    if (height.value === 0) {
        return;
    }
    const el = document.getElementById("my-tab") as HTMLElement;
    el.style.height = `${height.value + 100}px`
})


// ---------------upload file -----------------------

const fileList_ad = ref<UploadUserFile[]>([])
const fileBase_ad = ref<string>('')    // 上传的文件的base64
const upload_ad = ref<UploadInstance>()
const handleChange_ad: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
    if (fileList_ad.value.length == 0) {
        fileList_ad.value.push(uploadFile)
        const reader = new FileReader()
        reader.readAsDataURL(uploadFile.raw as Blob)
        reader.onload = () => {
            const base64data = reader.result
            const img = base64data as string;
            fileBase_ad.value = img.split('data:application/pdf;base64,')[1]
        }
    } else {
        fileList_ad.value[0] = uploadFile
        const reader = new FileReader()
        reader.readAsDataURL(uploadFile.raw as Blob)
        reader.onload = () => {
            const base64data = reader.result
            const img = base64data as string;
            fileBase_ad.value = img.split('data:application/pdf;base64,')[1]
        }
    }
    currentStep.value = 1;
}

// 当上传的文件超过1 个时， 则替换之前的那一个
const handleExceed_ad: UploadProps['onExceed'] = (files, fileList) => {
    upload_ad.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    upload_ad.value!.handleStart(file)
}

const handleRemove_ad: UploadProps['onRemove'] = (file, uploadFiles) => {
    fileBase_ad.value = ''
}


const fileList_cv = ref<UploadUserFile[]>([]);
const fileBase_cv = ref<string>('')    // 上传的文件的base64
const upload_cv = ref<UploadInstance>()
const handleChange_cv: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
    if (fileList_cv.value.length == 0) {
        fileList_cv.value.push(uploadFile)
        const reader = new FileReader()
        reader.readAsDataURL(uploadFile.raw as Blob)
        reader.onload = () => {
            const base64data = reader.result
            const img = base64data as string;
            fileBase_cv.value = img.split('data:application/pdf;base64,')[1]
        }
    } else {
        fileList_cv.value[0] = uploadFile
        const reader = new FileReader()
        reader.readAsDataURL(uploadFile.raw as Blob)
        reader.onload = () => {
            const base64data = reader.result
            const img = base64data as string;
            fileBase_cv.value = img.split('data:application/pdf;base64,')[1]
        }
    }
    currentStep.value = 1;
}

// 当上传的文件超过1 个时， 则替换之前的那一个
const handleExceed_cv: UploadProps['onExceed'] = (files, fileList) => {
    upload_cv.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    upload_cv.value!.handleStart(file)
}

const handleRemove_cv: UploadProps['onRemove'] = (file, uploadFiles) => {
    fileBase_cv.value = ''
}

const currentStep = ref(0)
const status1 = ref<"" | "success" | "error" | "wait" | "process" | "finish">("")
const status2 = ref<"" | "success" | "error" | "wait" | "process" | "finish">("")

const submitUpload = () => {
    if (fileBase_ad.value == '' && fileBase_cv.value == '') {
        errorNotification("You haven't select any document yet.");
        return;
    }
    let p1: Promise<any>, p2: Promise<any>
    if (fileBase_ad.value) {
        p1 = post('/api/getAcademicTranscript/' + personalInfo.value.id, { "AcademicTranscript": fileBase_ad.value }).then(_ => {
            successNotification('New Acdemic Transcript uploaded.')
        })
    }
    if (fileBase_cv.value) {
        p2 = post('/api/getCV/' + personalInfo.value.id, { "cv": fileBase_cv.value }).then(_ => {
            successNotification('New CV uploaded.')
        })
    }

    Promise.all([p1, p2]).then(_ => {
        currentStep.value = 2;
    }).catch(err => {
        errorNotification('Something went wrong during uploading :(')
    })
}

const onEdit = ref(false);

const loadingCV = ref(false);
const loadingAD = ref(false);
const academicRecord = ref<string>();


async function getCV() {
    loadingCV.value = true;

    let user = await get(`api/getCV/` + personalInfo.value.id)

    if (user.cv != null && user.cv != undefined && user.cv != "") {
        academicRecord.value = user.cv;
        // let blob = base64toBlob(academicRecord.value, 'application/pdf');
        var Blob = base64ToBlob(academicRecord.value)
        let bloburl = window.URL.createObjectURL(Blob);

        window.open(bloburl);
    }
    else {
        warningNotification('Did not detect your CV, please upload your CV')
    }
    loadingCV.value = false;
}

async function getAcademicRecord() {
    loadingAD.value = true;
    let user = await get(`api/getAcademicTranscript/` + personalInfo.value.id)

    if (user.AcademicTranscript != null && user.AcademicTranscript != undefined && user.AcademicTranscript != "") {
        academicRecord.value = user.AcademicTranscript;

        var Blob = base64ToBlob(academicRecord.value)
        let bloburl = window.URL.createObjectURL(Blob);
        window.open(bloburl);
    } else {
        warningNotification('Did not detect your academic transcript, please upload your academic transcript')
    }
    loadingAD.value = false;
}


const previewModalOpen = ref<boolean>(false);
const base64File = ref<string>("");
const loadingPreviewAD = ref(false);
const loadingPreviewCV = ref(false);
const previewAD = async () => {
    previewModalOpen.value = true;
    loadingPreviewAD.value = true;
    base64File.value = await get(`api/getAcademicTranscript/` + personalInfo.value.id).then(res => res.AcademicTranscript)
    if (base64File.value) {
        base64File.value = "data:application/pdf;base64," + base64File.value;
    } else {
        warningNotification('Did not detect your academic transcript, please upload your academic transcript')
        previewModalOpen.value = false;
    }

    loadingPreviewAD.value = false;
}

const previewCV = async () => {
    previewModalOpen.value = true;
    loadingPreviewCV.value = true;
    base64File.value = await get(`api/getCV/` + personalInfo.value.id).then(res => res.cv)
    if (base64File.value) {
        base64File.value = "data:application/pdf;base64," + base64File.value
    } else {
        warningNotification('Did not detect your CV, please upload your CV')
        previewModalOpen.value = false;
    }

    loadingPreviewCV.value = false;
}
</script>

<template>
    <div class="profile-container">
        <div class="profile-pane">
            <el-tabs :tab-position="tabPosition" style="height:450px" class="demo-tabs" id="my-tab"
                v-model="currentTab">
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
                    <Transition name="slide-fade">
                        <div class="content document-edit" v-if="onEdit">
                            <div class="back" @click="onEdit = false">
                                <el-icon>
                                    <ArrowLeft />
                                </el-icon>
                            </div>
                            <h3>Change Documents</h3>
                            <div class="uploading-steps">
                                <el-steps direction="vertical" :active="currentStep" finish-status="success">
                                    <el-step title="Step 1" description="Select pdf file from your local PC" />
                                    <el-step title="Step 2" description="Click 'Upload' button to upload to the server"
                                        :status="status2" />
                                </el-steps>
                            </div>
                            <el-upload :limit="1" ref="uploadAD" accept="application/pdf"
                                v-model:file-list="fileList_ad" :on-change="handleChange_ad"
                                :on-exceed="handleExceed_ad" :on-remove="handleRemove_ad" :auto-upload="false">
                                <template #trigger>
                                    <el-button type="primary">Select your Academic Transcript</el-button>
                                </template>

                                <template #tip>
                                    <div class="el-upload__tip text-red">
                                        Requirement: PDF files less than 2MB
                                    </div>
                                </template>
                            </el-upload>
                            <!-- -----------------------AD在上---------CV在下------------------------------- -->
                            <el-upload :limit="1" ref="uploadCV" accept="application/pdf"
                                v-model:file-list="fileList_cv" :on-change="handleChange_cv"
                                :on-exceed="handleExceed_cv" :on-remove="handleRemove_cv" :auto-upload="false">
                                <template #trigger>
                                    <el-button type="primary">Select your CV</el-button>
                                </template>

                                <template #tip>
                                    <div class="el-upload__tip text-red">
                                        Requirement: PDF files less than 2MB
                                    </div>
                                </template>
                            </el-upload>

                            <el-button class="ml-3" type="success" @click="submitUpload">
                                Upload
                            </el-button>
                        </div>
                        <div v-else class="content document-check">
                            <div class="back" @click="onEdit = true">
                                <el-icon>
                                    <DocumentAdd />
                                </el-icon>
                            </div>

                            <h3>Download Documents</h3>
                            <div style="height: 90px; margin-bottom: 10px;" class="document-check-wrapper">
                                <div style="display: flex; flex-direction: column; align-items: center">
                                    <div class="document" v-loading="loadingAD" @click="getAcademicRecord">
                                        <el-icon>
                                            <Document />
                                        </el-icon><span>Academic Transcript</span>
                                    </div>
                                    <el-button :icon="View" circle style="margin-top: 20px" @click="previewAD" />
                                </div>
                                <div style="display: flex; flex-direction: column; align-items: center">
                                    <div class="document" v-loading="loadingCV" @click="getCV">
                                        <el-icon>
                                            <Document />
                                        </el-icon><span>CV</span>
                                    </div>
                                    <el-button :icon="View" circle style="margin-top: 20px" @click="previewCV" />
                                </div>

                            </div>
                        </div>
                    </Transition>

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
                                    <el-button type="primary" @click="sendCode(60)" plain v-else class="verification">
                                        Send
                                        Code
                                    </el-button>
                                </div>


                            </el-form-item>

                            <el-form-item prop="code" v-if="fieldsToChange.find(v => v === 'email')">
                                <h4>verification&nbspcode</h4>
                                <el-input v-model="changeProfileDTO.code" />
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
                                    style="margin-bottom: 20px" v-if="fieldsToChange.length > 0">Submit
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>

        <div class="pdf-preview" v-if="previewModalOpen">
            <PDFViewer :data="base64File" />
            <button class="close-btn" @click="previewModalOpen = false">
                <el-icon>
                    <Close />
                </el-icon>
            </button>
        </div>
    </div>


</template>


<style>
.el-tabs__content {
    height: 100%;
    overflow: visible !important;

}

@media only screen and (max-width: 770px) {
    .el-tabs__content {
        height: 100%;
        overflow: hidden !important;

    }
}
</style>
<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css?family=Nunito:400,900|Montserrat|Roboto');

.profile-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: flex-start;
    margin-left: auto;
    padding: 10px;
}

.pdf-preview {
    margin-right: 20px;
    border: 5px dashed #64bee8;
    position: relative;

    .close-btn {
        cursor: pointer;
        position: absolute;
        right: -35px;
        top: -35px;
        border-style: none;
        height: 20px;
        box-sizing: content-box;
        background-color: transparent;
        border: 5px dashed #64bee8;

        .el-icon {
            width: fit-content;
            height: fit-content;
        }

        .el-icon:hover {
            color: #64bee8;
        }
    }

}

@media only screen and (max-width: 1360px) {
    .profile-container {
        flex-wrap: wrap;

        .pdf-preview {
            margin: 0 auto;

        }
    }
}

.back {
    display: flex;
    align-items: center;
    position: absolute;
    left: 120px;
    width: 30px;
    height: 100%;
    background-color: rgb(236, 236, 236);
    transition: all 0.2s ease;
    cursor: pointer;
}

.back:hover {
    width: 40px;

    .el-icon {
        font-size: 30px;
    }
}

.slide-fade-enter-active {
    transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
    transform: translateX(-20px);
    opacity: 0;
}



.slide-fade-enter-active.document-check {
    transition: all 0.3s ease-out;
    transition-delay: .5s;
}

.slide-fade-leave-active.document-check {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);

}

.slide-fade-enter-active.document-edit {
    transition: all 0.3s ease-out;
    transition-delay: .5s;
}

.slide-fade-leave-active.document-edit {
    transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);

}

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
    display: flex;
    margin-bottom: 20px;

    .el-tabs--left {
        overflow: visible;
        margin-left: 10vw;

    }



    .el-tab-pane {
        position: relative;
        width: 100%;
        height: 100%;


        .content {
            background-color: rgb(255, 255, 255);
            position: relative;
            width: 600px;
            min-height: 380px;
            left: -30px;
            top: 40px;
            box-shadow: var(--el-box-shadow-light);
            padding-left: 140px;

            h3 {
                font-family: $heading;
                font-size: 20px;
                color: $primary;
                padding-top: 20px;
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

        .uploading-steps {
            height: 90px;
            margin-bottom: 10px;
        }

        .document-edit {
            padding-left: 200px;
            position: relative;
        }

        .document-check {
            padding-left: 200px;
            position: relative;

            &-wrapper {
                display: flex;
                column-gap: 10px;
                height: 260px !important;
                align-items: center;



                .el-icon {
                    font-size: 80px;

                }

                .document {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    border: 1px solid rgb(160, 207, 255);
                    border-radius: 4px;
                    color: rgb(64, 158, 255);
                    cursor: pointer;
                    padding: 20px;
                    background-color: rgb(236, 245, 255);
                    transition: all .1s ease;
                }

                .document:hover {
                    background-color: rgb(64, 158, 255);
                    color: #fff;
                }

                .document:active {
                    background-color: rgb(236, 245, 255);
                    color: rgb(64, 158, 255);
                }


            }
        }
    }
}

@media only screen and (max-width: 770px) {
    .profile-pane {
        width: auto;
        justify-content: center;

        .el-tab-pane {
            .content {
                width: 90vw;
                left: 0;
                top: 0;
                margin: 0 10px;
                padding-left: 50px;
            }

        }

        .back {
            left: 0;

        }

        :deep(.el-tabs__nav-scroll) {
            background-color: $primary;
            padding: 15px 0 5px 0;
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

:deep(.el-tabs__nav-scroll) {
    background-color: $primary;
    padding: 30px 0;
}


:deep(.el-tabs__nav) {
    margin: 0 10px;
    /* 使用rpx没有效果 */
}

:deep(.el-tabs__item.is-left) {
    padding: 50px 10px;
    display: flex;
    justify-content: center;
    align-items: center;
}

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

/*隐藏tab下面的一横*/
:deep(.el-tabs__active-bar) {
    display: none;
}
</style>
  