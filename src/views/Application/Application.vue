<script setup lang="ts">
import {UploadFilled, Avatar, Key, Management, Plus} from '@element-plus/icons-vue'
import {computed, onBeforeMount, reactive, ref, watch, defineAsyncComponent} from 'vue';
import {ElMessage, FormInstance, FormRules} from 'element-plus'
import {useThrottleFn} from '@vueuse/core'
import {} from 'element-plus'
import {get, post} from '@/utils/request'
import {useRoute, useRouter} from 'vue-router'
import * as dayjs from "dayjs";
import ApplicationPreferCourseList from '@/components/applicationUseful/ApplicationPreferCourseList.vue'

const ApplicationCourse = defineAsyncComponent(() => import('@/components/applicationUseful/ApplicationCourse.vue'))

const route = useRoute();
const router = useRouter();

const metaLoading = ref(false);
const saveLoading = ref(false);
const userProfileLoading = ref(false);

// init application data
type ApplicationMetaInfo = {
  term: string
  termID: number
  createdDateTime: string
  status: string
}

type applicationData = {
  name: string;
  upi: string;
  auid: number;
  email: string;
  currentlyOverseas: boolean;
  willBackToNZ: boolean;
  isCitizenOrPR: boolean;
  haveValidVisa: boolean;
  enrolDetails: string;
  studentDegree: string;
  haveOtherContracts: boolean;
  otherContracts: string;
  maximumWorkingHours: number;
}

type preferCourse = {
  courseID: number;
  courseNum: string;
  courseName: string;
  hasLearned: boolean;
  grade: string;
  explanation: string;
  preExperience: string;
  preference: number;
}

const userID = ref(localStorage.getItem("userID") || "Unknown");
const applicationID = ref(0);
const applicationMetaInfo = ref({} as ApplicationMetaInfo);
const termName = ref("");
const preferCourseList = ref([] as preferCourse[]);

const data = reactive({} as applicationData);
const currentUserProfile = reactive({} as applicationData);
const getUserProfile = (currentUserProfile: any, saved: any) => {
  if (currentUserProfile === null) {
    return saved;
  } else {
    return null;
  }
}


const step = ref(0); // current step
const atFirst = ref(true); // at first step?
const atLast = ref(false) // at last step?
const stepArr = reactive([true, false, false, false]) // represents which step you are currently at. You are at the index of [true]
const statusArr = reactive<('process' | 'wait' | 'finish' | 'error' | 'success')[]>(['process', 'wait', 'wait', 'wait']) // status of each step
// throttled version next function in case of too many clicks at the same time.
// the callback function will only be excuted once every 0.8s
const next = useThrottleFn(() => {
  step.value++;
  saveSession(); // save the data to sessionStorage
  if (step.value >= 3) {
    atLast.value = true;
  } else {
    atFirst.value = false;
  }
}, 800)


// throttled version prev function in case of too many clicks at the same time.
const prev = useThrottleFn(() => {
  step.value--;
  saveSession(); // save the data to sessionStorage
  if (step.value <= 0) {
    atFirst.value = true;
  } else {
    atLast.value = false;
  }
}, 800)

// once step changed, load the next step AFTER the current step vanish animation finishes
// 如果不设置延迟加载的化，下一个界面会在当前界面消失前就显示到下面，造成一瞬的卡顿影响用户体验.
watch(step, (newStep, oldStep) => {
  stepArr[oldStep] = false; // 使当前步骤先显示消失动画
  setTimeout(() => {
    statusArr[newStep] = 'process'; // 使上方的步骤条当前步骤显示处理中颜色
    stepArr[newStep] = true;
  }, 600); // 在0.6秒后显示新的步骤的出现动画

})


const formRef = ref<FormInstance>(); // Form DOM instance
// 申请表单数据

// initialize data

if (!isNaN(parseInt(route.params.applicationID[0]))) {
  applicationID.value = parseInt(route.params.applicationID[0])
} else {
  router.push('/404')
}

get('api/application/' + applicationID.value).then(res => {
  termName.value = res.term;
  applicationMetaInfo.value.term = res.term;
  applicationMetaInfo.value.status = res.status;
  applicationMetaInfo.value.createdDateTime = res.createdDateTime;
  applicationMetaInfo.value.termID = res.termID;
  metaLoading.value = true;

}).catch((err) => {
  console.log(err)
})


get('api/currentUserProfile').then(res => {
  currentUserProfile.name = res.name;
  currentUserProfile.email = res.email;
  currentUserProfile.upi = res.upi;
  currentUserProfile.auid = res.auid;

  data.name = res.name;
  data.email = res.email;
  data.upi = res.upi;
  data.auid = res.auid;
  userProfileLoading.value = true;

}).then(() => {
  get('api/saveApplication/' + applicationID.value).then(res => {
    let personalDetail = res.applicationPersonalDetail;
    let courseList = res.course;

    data.name = getUserProfile(currentUserProfile.name, personalDetail.name);
    data.email = getUserProfile(currentUserProfile.email, personalDetail.email);
    data.upi = getUserProfile(currentUserProfile.upi, personalDetail.upi);
    data.auid = getUserProfile(currentUserProfile.auid, personalDetail.auid);

    data.currentlyOverseas = personalDetail.currentlyOverseas;
    data.willBackToNZ = personalDetail.willBackToNZ;
    data.isCitizenOrPR = personalDetail.isCitizenOrPR;
    data.haveValidVisa = personalDetail.haveValidVisa;
    data.enrolDetails = personalDetail.enrolDetails;
    data.studentDegree = personalDetail.studentDegree;
    data.haveOtherContracts = personalDetail.haveOtherContracts;
    data.otherContracts = personalDetail.otherContracts;
    data.maximumWorkingHours = personalDetail.maximumWorkingHours;

    preferCourseList.value = courseList;

    preferCourseList.value.sort((a, b) => {
      return a.preference - b.preference;
    })


    saveLoading.value = true;
  }).catch((err) => {
    saveLoading.value = true;
  })
}).catch((err) => {
  console.log(err)
})



const courseVisible = reactive({
  visible: false
})
const showCourseChooser = () => {
  courseVisible.visible = true
}

const add_course = (course: any) => {
  if (preferCourseList.value.map((item) => item.courseID).includes(course.courseID)) {
    ElMessage({
      message: 'You cannot add the same course',
      type: 'warning',
    });
    return;
  }
  if (preferCourseList.value.length >= 10) {
    ElMessage({
      message: 'You can only add up to 10 courses',
      type: 'warning',
    });
    return;
  }

  preferCourseList.value.push({
    courseID: course.courseID,
    courseNum: course.courseNum,
    courseName: course.courseName,
    hasLearned: false,
    grade: "",
    explanation: "",
    preExperience: "",
    preference: preferCourseList.value.length + 1
  })

}


//-----表单验证相关------start-----------------------------------------------
const validateWillComeBackToNZ = (rule: any, value: any, callback: any) => {
  if (data.currentlyOverseas === false) {
    callback();
  } else if (typeof value === 'undefined') {
    callback(new Error('Please select one option'));
  } else {
    callback();
  }
}

const validateHasWorkVisa = (rule: any, value: any, callback: any) => {
  if (data.isCitizenOrPR === true) {
    callback();
  } else if (typeof value === 'undefined') {
    callback(new Error('Please select one option'));
  } else {
    callback();
  }
}

// form validation rules for data
const dataRules = reactive<FormRules>({
  // step 1 rules
  name: [
    {required: true, message: 'Please enter your full name', trigger: 'blur'},
  ],
  upi: [
    {required: true, message: 'Please enter you upi', trigger: 'blur'},
    {pattern: /^[a-z]+\d+/, message: 'UPI Example: rzac999', trigger: 'blur'}
  ],
  auid: [
    {required: true, message: 'Please enter your student ID', trigger: 'blur'},
    {type: "number", message: 'Student ID must be an number', trigger: 'blur'}
  ],
  email: [
    {required: true, message: 'Please enter your preferred email', trigger: 'blur'},
    {type: 'email', message: 'Please enter correct email address', trigger: ['blur', 'change']}
  ],
  // step 2 rules
  currentlyOverseas: [
    {required: true, message: 'Please select one option', trigger: 'change'},
  ],
  willBackToNZ: [ // isCurrentlyOverseas 的子问题
    {validator: validateWillComeBackToNZ, trigger: 'change'},
  ],
  isCitizenOrPR: [
    {required: true, message: 'Please select one option', trigger: 'change'},
  ],
  haveValidVisa: [
    {validator: validateHasWorkVisa, trigger: 'change'},
  ],
  enrolDetails: [
    {required: true, message: 'Please select one option', trigger: 'change'},
  ],
  studentDegree: [
    {required: true, message: 'Please select one option', trigger: 'change'},
  ],
  haveOtherContracts: [
    {required: true, message: 'Please select one option', trigger: 'change'},
  ],
  maximumWorkingHours: [
    {required: true, message: 'Please enter your preffered working hours', trigger: 'change'},
  ]
})

// once the step changed, validate invoke validateStep() function to validate data of previous step.
watch(step, async (newStep, oldStep) => {
  // if there exists invalid fields
  let valid = await validateStep(oldStep)
  if (!valid) {
    ElMessage({
      showClose: true,
      message: 'You have invalid input(s), please check again.',
      type: 'error',
    })
  }
})
/**
 *
 * @param step represent the step to validate
 * @description this function will be invoked after user click 'Next step' button
 * It will check whether all the input fields in that step is validate or not.
 * For example, if the user forgot to input a field, it will pops up an warning message.
 */
const validateStep = async (step: number) => {
  let flag = true;
  if (step === 0) {
    await formRef.value?.validateField(
        ['name', 'upi', 'studentId', 'email'],
        (valid) => {
          flag = valid;
        })
  } else if (step === 1) {
    await formRef.value?.validateField(
        ['currentlyOverseas', 'willComeBackToNZ', 'isCitizenOrPR',
          'haveValidVisa', 'studentDegree', 'hasOtherContract', 'maximumWorkingHours'],
        (valid) => {
          flag = valid;
        })
  } else if (step === 2) {

  } else {

  }
  // change the status of status bar
  if (flag) {
    statusArr[step] = 'success'
  } else {
    statusArr[step] = 'error'
  }
  return flag;
}
//---------表单验证相关------end--------------------------------------

// -----Work by laiyu -------
// -----Testing upload file ------ start
import type  {UploadProps, UploadUserFile,  UploadInstance, UploadRawFile} from "element-plus";
import axios from "axios";
import {getBaseURL} from "xe-utils";
import { genFileId } from 'element-plus'
// 上传文件后对文件的预览于删除
// uploadFile 对于当个文件上传， uploadFiles 对于多个文件上传
// 目前考虑的是上传单个文件， 后续又修改在添加功能
const fileList_cv = ref<UploadUserFile[]>([]);
const fileCVURL_cv = ref<string>('')
const upload_cv = ref<UploadInstance>()
// academic data : ad
const fileList_ad = ref<UploadUserFile[]>([]);
const fileCVURL_ad = ref<string>('')
const upload_ad = ref<UploadInstance>()
// 当上传的文件超过1 个时， 则替换之前的那一个
const handleExceed_cv: UploadProps['onExceed'] = (files, fileList) => {
  upload_cv.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload_cv.value!.handleStart(file)
}
// 检测文件上传
const handleChange_cv: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
  if (fileList_cv.value.length ==  0) {
    fileList_cv.value.push(uploadFile)
    // console.log(fileList.value)
    // let url = window.URL.createObjectURL(uploadFile.raw as Blob)
    // fileCVURL_cv.value = url
    const reader = new FileReader()
    reader.readAsDataURL(uploadFile.raw as Blob)
    reader.onload = () => {
      const base64data = reader.result
      const img = base64data as string;
      // console.log(img)
      fileCVURL_cv.value = img.split('data:application/pdf;base64,')[1]
    }
  }
  else{
    fileList_cv.value[0] = uploadFile
    // let url = window.URL.createObjectURL(uploadFile.raw as Blob)
    // fileCVURL_cv.value = url
    const reader = new FileReader()
    reader.readAsDataURL(uploadFile.raw as Blob)
    reader.onload = () => {
      const base64data = reader.result
      const img = base64data as string;
      // console.log(img)
      fileCVURL_cv.value = img.split('data:application/pdf;base64,')[1]
    }
  }
  // console.log(fileList_cv.value)
  // console.log(fileCVURL_cv.value)
  // console.log(upload_cv.value)
}
const handleRemove_cv: UploadProps['onRemove'] = (file, uploadFiles) => {
  fileCVURL_cv.value = ''
}
const handleRemove_ad: UploadProps['onRemove'] = (file, uploadFiles) => {
  fileCVURL_ad.value = ''
}
// academic data : ad
const handleExceed_ad: UploadProps['onExceed'] = (files, fileList) => {
  upload_ad.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload_ad.value!.handleStart(file)
}
// 检测文件上传
const handleChange_ad: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
  if (fileList_ad.value.length ==  0) {
    fileList_ad.value.push(uploadFile)
    // console.log(fileList.value)
    // let url = window.URL.createObjectURL(uploadFile.raw as Blob)
    // fileCVURL_ad.value = url
    // base64 encode
    const reader = new FileReader()
    reader.readAsDataURL(uploadFile.raw as Blob)
    reader.onload = () => {
      const base64data = reader.result
      const img = base64data as string;
      // console.log(img)
      fileCVURL_ad.value = img.split('data:application/pdf;base64,')[1]
    }
  }
  else{
    fileList_ad.value[0] = uploadFile
    // let url = window.URL.createObjectURL(uploadFile.raw as Blob)
    // fileCVURL_ad.value = url
    const reader = new FileReader()
    reader.readAsDataURL(uploadFile.raw as Blob)
    reader.onload = () => {
      const base64data = reader.result
      const img = base64data as string;
      // console.log(img)
      fileCVURL_ad.value = img.split('data:application/pdf;base64,')[1]
    }
  }
  // console.log(fileList_ad.value)
  // console.log(fileCVURL_ad.value)
  // console.log(upload_ad.value)
}
function handleUploadFile(){
  let message = '';
  let submit = true;
  if (fileList_cv.value.length == 0 && fileList_ad.value.length == 0){
    submit = false;
    alert('Please upload your CV and academic data')
  }
  else if (fileList_cv.value.length == 0 && fileList_ad.value.length == 1)
  {
    message = 'Save academic data. Please upload your CV later.'
  }
  else if (fileList_cv.value.length == 1 && fileList_ad.value.length == 0)
  {
    message = 'Saved CV. Please upload your academic data later.'
  }
  else{
    message = 'Upload successfully'
  }
  if (submit) {
    post('api/uploadFile', {
      'fileCV' : fileList_cv.value,
      'fileURL':fileCVURL_cv,
      'fileAD': fileList_ad.value,
      'fileURLAD': fileCVURL_ad
    }).then(
        res => {
          console.log(res)
          ElMessage({
            showClose: true,
            message: message,
            type: 'success',
          })
        }
    ).catch(err => {
      console.log(err)
      ElMessage({
        showClose: true,
        message: err.response.data['message'],
        type: 'error',
      })
    })
  }
}
// -----Testing upload file ------ end

//---------保存数据相关------start------------------------------------
const save = () => {
  post(`api/saveApplication/${applicationID.value}`, {"applicationPersonalDetail": data, "course": preferCourseList.value}).then(
      res => {
        console.log(res)
        ElMessage({
          showClose: true,
          message: 'Save successfully',
          type: 'success',
        })
      }
  ).catch(err => {
    console.log(err)
    ElMessage({
      showClose: true,
      message: err.response.data['message'],
      type: 'error',
    })
  })
}
const saveLocal = () => {
  localStorage.setItem('applicationData', JSON.stringify(data));
}
const saveSession = () => {
  sessionStorage.setItem('applicationData', JSON.stringify(data));
}


//---------保存数据相关------end
</script>

<template>
  <div class="application-header">
    <img src="@/assets/logo/uoa.svg" alt="">
    <el-card class="application-meta-box-card">
      <div v-loading="!(metaLoading && userProfileLoading && saveLoading)">
        <p>ApplicationID: {{ applicationID }}</p>
        <p>UserID: {{ userID }}</p>
        <p>Created Date Time: {{ dayjs(applicationMetaInfo.createdDateTime).format('DD/MM/YYYY HH:mm') }}</p>
        <p>Status:
          <el-tag>{{ applicationMetaInfo.status }}</el-tag>
        </p>
      </div>
    </el-card>

  </div>
  <div v-loading="!(metaLoading && userProfileLoading && saveLoading)">
    <el-row justify="center">
      <p style="font-size: 30px">Apply for {{ termName }} Tutor or Marker</p>
    </el-row>

    <div class="application-container">

      <div class="progress-bar">
        <el-steps :active="step" simple process-status="process" finish-status="finish" space="200px">
          <el-step title="Identity Information" description="" :status="statusArr[0]" :icon="Key"/>
          <el-step title="Personal Detail" description="" :status="statusArr[1]" :icon="Avatar"/>
          <el-step title="Courses" description="" :status="statusArr[2]" :icon="Management"/>
          <el-step title="File Upload" description="" :status="statusArr[3]" :icon="UploadFilled"/>
        </el-steps>
      </div>

      <div class="application-form-container">

        <el-form ref="formRef" :model="data" :rules="dataRules" label-width="120px" class="data"
                 :hide-required-asterisk=true status-icon label-position="top">
          <Transition>
            <div v-show="stepArr[0]">
              <el-alert
                  title="Why can't some fields be entered?"
                  type="warning"
                  description="These are identifying information. Because you have provided your identity information before, any modification is not supported on the application page."
                  show-icon
              />
              <el-form-item label="Name" prop="name">
                <el-input v-model="data.name" :disabled="currentUserProfile.name !== null"/>
              </el-form-item>
              <el-form-item label="UPI" prop="upi">
                <el-input v-model="data.upi" :disabled="currentUserProfile.upi !== null"/>
              </el-form-item>
              <el-form-item label="Student ID (AUID)" prop="auid">
                <el-input v-model.number="data.auid" :disabled="currentUserProfile.auid !== null"/>
              </el-form-item>
              <el-form-item label="Preferred email" prop="email">
                <el-input v-model="data.email"/>
              </el-form-item>
            </div>
          </Transition>

          <Transition>
            <div v-show="stepArr[1]" class="step2">
              <div>
                <p>Currently overseas?</p>
                <el-form-item prop="currentlyOverseas">
                  <el-radio-group v-model="data.currentlyOverseas">
                    <el-radio :label="true">Yes</el-radio>
                    <el-radio :label="false">No</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div class="indent" v-show="data.currentlyOverseas">
                <p>Will you come back to NZ?</p>
                <el-form-item prop="willComeBackToNZ">
                  <el-radio-group v-model="data.willComeBackToNZ">
                    <el-radio :label="true">Yes</el-radio>
                    <el-radio :label="false">No</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div>
                <p>Citizen or Permanent resident?</p>
                <el-form-item prop="isCitizenOrPR">
                  <el-radio-group v-model="data.isCitizenOrPR">
                    <el-radio :label="true">Yes</el-radio>
                    <el-radio :label="false">No</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div class="indent" v-show="data.isCitizenOrPR === false">
                <p>Do you have a valid work visa?</p>
                <el-form-item prop="haveValidVisa">
                  <el-radio-group v-model="data.haveValidVisa">
                    <el-radio :label="true">Yes</el-radio>
                    <el-radio :label="false">No</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div>
                <p>Undergraduate or postgraduate?</p>
                <el-form-item prop="studentDegree">
                  <el-alert title="Notice" type="info"
                            description="Postgraduate means that student has already completed a degree"
                            show-icon/>
                  <el-radio-group v-model="data.studentDegree">
                    <el-radio label="Undergraduate">Undergraduate</el-radio>
                    <el-radio label="Postgraduate">Postgraduate</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div>
                <p>Do you have any other TA/GTA contracts for that semester?</p>
                <el-form-item prop="hasOtherContract">
                  <el-radio-group v-model="data.haveOtherContracts">
                    <el-radio :label="true">Yes</el-radio>
                    <el-radio :label="false">No</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div class="indent" v-show="data.haveOtherContracts">
                <el-form-item>
                  <el-input v-model="data.otherContracts" maxlength="200"
                            placeholder="Please Describe these TA/GTA contracts..." show-word-limit
                            type="textarea"/>
                </el-form-item>
              </div>
              <div>
                <p>Maximum number of hours per week, you would like to work.</p>
                <el-form-item prop="maximumWorkingHours">
                  <el-input-number v-model="data.maximumWorkingHours" :min="5" :max="40"
                                   controls-position="right"/>
                  <span style="margin-left:10px">hours</span>
                </el-form-item>
              </div>
            </div>
          </Transition>
        </el-form>

        <Transition>
          <div v-show="stepArr[2]" class="step3">

            <ApplicationPreferCourseList v-model:preferCourseList="preferCourseList" />
            <el-row justify="center">
              <el-button type="primary" :icon="Plus" size="large" @click="showCourseChooser">Add Prefer Courses
              </el-button>
            </el-row>


        </div>
        </Transition>


        <Transition>
          <div v-show="stepArr[3]">
            <el-divider>Upload your CV</el-divider>

            <el-upload class="upload-cv" drag
                       ref="upload_cv"
                       accept="application/pdf"

                       v-model:file-list = "fileList_cv"
                       :on-change = "handleChange_cv"
                       :on-exceed = "handleExceed_cv"
                       :on-remove = "handleRemove_cv"
                       :limit = "1">
              <el-icon class="el-icon--upload">
                <upload-filled/>
              </el-icon>
              <div class="el-upload__text">
                Drop your CV here or <em>click to upload</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  Require: PDF files with a size less than 500kb
                </div>
              </template>
            </el-upload>

            <el-divider>Upload your Transcript</el-divider>
            <el-upload class="upload-academicData" drag
                       ref="upload_ad"
                       accept="application/pdf"
                       v-model:file-list = "fileList_ad"
                       :on-change = "handleChange_ad"
                       :on-exceed = "handleExceed_ad"
                       :on-remove = "handleRemove_ad"
                       :limit = "1">
              <el-icon class="el-icon--upload">
                <upload-filled/>
              </el-icon>
              <div class="el-upload__text">
                Drop your academic data here or <em>click to upload</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  Require: PDF files with a size less than 500kb
                </div>
              </template>
            </el-upload>
          </div>
        </Transition>

      </div>

      <el-button @click="handleUploadFile" >Test</el-button>


      <div class="application-control-btns">
        <el-button @click="prev()" :disabled="atFirst">Previous Step</el-button>
        <el-button @click="save" class="application-control-btns-main" type="success" plain v-if="step <= 2">Save
        </el-button>
        <el-button @click="" class="application-control-btns-main" type="primary" v-else>Submit</el-button>
        <el-button @click="next()" :disabled="atLast">Next Step</el-button>
      </div>
    </div>

  </div>

  <ApplicationCourse v-if="applicationMetaInfo.termID" :visible="courseVisible" :termID="applicationMetaInfo.termID" @added_course="add_course"/>





</template>

<style scoped lang="scss">
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.application-header {
  background-color: rgb(241, 241, 241);
  height: 80px;
  margin-bottom: 50px;
  justify-content: flex-end;
  align-items: flex-end;
  display: flex;

  img {
    width: 110px;
    position: absolute;
    left: 50%;
    top: 10px;
    transform: translateX(-50%);
  }
}

.application-meta-box-card {
  margin-right: 20px;
  position: absolute;
  top: 25px;

}


.application-container {
  width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 92px; // 预留92px空位给表单，防止挡住内容

  .progress-bar {
    z-index: 999;
    position: sticky;
    top: 0;
    padding: 20px 0;
    width: 100%;
    background-color: rgb(255, 255, 255, 0.8);
  }

  .application-form-container {
    width: 700px;

    .step2 {
      display: flex;
      flex-direction: column;
      // row-gap: 20px;
    }
  }
}

.application-control-btns {
  width: 600px;
  display: flex;
  background-color: rgb(255, 255, 255, 0.8);
  padding-top: 10px;
  padding-bottom: 50px;
  position: fixed;
  bottom: 0;

  .el-button:first-child {
    margin-right: auto;
  }

  .el-button:last-child {
    margin-left: auto;
  }

  &-main {
    position: relative;
    left: -18px;
  }
}

.indent {
  margin-left: 30px;
  position: relative;
}

.indent::before {
  content: "";
  position: absolute;
  left: -10px;
  width: 3px;
  height: 50px;
  background-color: rgb(242, 242, 242);
}

.step3{
  width: 100%;
}


</style>