<script setup lang="ts">
import {reactive, ref} from 'vue';
import {get, post, put} from '@/utils/request'
import {ElNotification, genFileId, UploadInstance, UploadProps, UploadRawFile, UploadUserFile} from "element-plus";
import { warningNotification, errorNotification, normalNotification, successNotification } from '@/utils/notification';

const id = ref<string>();
const name = ref<string>();
const email = ref<string>();
// const upi = ref<string>();
// const auid = ref<string>();
// const currentlyOverseas = ref<string>();
// const willBackToNZ = ref<string>();
// const isCitizenOrPR = ref<string>();
// const haveValidVisa = ref<string>();
// const enrolDetails = ref<string>();
// const studentDegree = ref<string>();
// const otherContracts = ref<string>();
// const maximunWorking = ref<string>();
const academicRecord = ref<string>();
const cv = ref<string>();
// const createDateTime = ref<string>();

type usertype = {
  id: string;
  name : string
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
  // cv : string;
  // academicRecord: string;
  createDateTime: string;
}

const detil = ref({} as usertype)

async function getUserProfile() {
  let user = await get(`api/currentUserProfile`)

    // let user = await get(`api/currentUserProfile`)
    // console.log(user)
    // id.value = user.id;
    // name.value = user.name;
    // email.value = user.email;
    // upi.value = user.upi;
    // auid.value = user.auid;
    // currentlyOverseas.value = user.currentlyOverseas;
    // willBackToNZ.value = user.willBackToNZ;
    // isCitizenOrPR.value = user.isCitizenOrPR;
    // haveValidVisa.value = user.haveValidVisa;
    // enrolDetails.value = user.enrolDetails;
    // studentDegree.value = user.studentDegree;
    // otherContracts.value = user.otherContracts;
    // maximunWorking.value = user.maximumWorkingHours;
    // createDateTime.value = user.createDateTime;
    //
    detil.value['id'] = user.id
    detil.value['name'] = user.name;
    detil.value['email'] = user.email;
    detil.value['upi'] = user.upi;
    detil.value['auid'] = user.auid;
    detil.value['currentlyOverseas'] = user.currentlyOverseas ;
    detil.value['willBackToNZ'] = user.willBackToNZ;
    detil.value['isCitizenOrPR'] = user.isCitizenOrPR;
    detil.value['haveValidVisa'] = user.haveValidVisa;
    detil.value['enrolDetails'] = user.enrolDetails;
    detil.value['studentDegree'] = user.studentDegree;
    detil.value['haveOtherContracts'] = user.haveOtherContracts;
    detil.value['otherContracts'] = user.otherContracts;
    detil.value['maximumWorkingHours'] = user.maximumWorkingHours;
    // detil.value['cv'] = user.cv;
    // detil.value['academicRecord'] = user.academicRecord;

}

function base64ToBlob(code: string | undefined) {
  //Base64一行不能超过76字符，超过则添加回车换行符。因此需要把base64字段中的换行符，回车符给去掉，有时候因为存在需要把加号空格之类的换回来，取决于base64存取时的规则。
  code = code.replace(/[\n\r]/g, '');
  var raw = window.atob(code);
  let rawLength = raw.length;
  //转换成pdf.js能直接解析的Uint8Array类型
  let uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], {type: 'application/pdf'});//转成pdf类型
}


async function getAcademicRecord() {
  let user = await get(`api/getAcademicTranscript/` + detil.value['id'] )
  console.log(user.cv)
  if (user.AcademicTranscript != null && user.AcademicTranscript != undefined && user.AcademicTranscript != "") {
    academicRecord.value = user.AcademicTranscript;
    // let blob = base64toBlob(academicRecord.value, 'application/pdf');
    var Blob = base64ToBlob(academicRecord.value)
    let bloburl = window.URL.createObjectURL(Blob);
    window.open(bloburl);
  }else{
    warningNotification('Did not detect your academic transcript, please upload your academic transcript')
  }

}

async function getCV() {
  // console.log(id.value)
  let user = await get(`api/getCV/` + detil.value['id'])
  console.log(user.cv)
  if (user.cv != null && user.cv != undefined && user.cv != "") {
    academicRecord.value = user.cv;
    // let blob = base64toBlob(academicRecord.value, 'application/pdf');
    var Blob = base64ToBlob(academicRecord.value)
    let bloburl = window.URL.createObjectURL(Blob);

    window.open(bloburl);
  }
  else{
    warningNotification('Did not detect your CV, please upload your CV')
  }

}

getUserProfile()
// -------------------- update profile -------------------- start

const dialogVisible = ref(false);
const dialogUploadVisible = ref(false);
import {Upload } from '@element-plus/icons-vue'
import {UploadFilled} from "@element-plus/icons-vue";

const updateProfile = ref({} as usertype)

const showUploadDialog= () => {
  dialogUploadVisible.value = true;
  dialog_openEvent()
}

const showDiaglog = () => {
  dialogVisible.value = true;
  dialog_openEvent()
}


const dialog_update_name = ref(true);
const dialog_update_email = ref(true);
const dialog_update_upi = ref(true);
const dialog_update_auid = ref(true);
const dialog_update_enrolDetails = ref(true);
const dialog_update_studentDegree = ref(true);
const dialog_check_email = ref(false);
const dialog_validated_email = ref(false);

const dialog_upload_cv = ref(true);
const dialog_upload_ad = ref(true);


const showinfo = () => {
  ElNotification({
    title: 'Info',
    message: 'This is an info message',
    type: 'info',
  })
}


const validationCode = ref('')



const submitUpdateForm = (form : usertype) => {
  console.log(form)
  const submitStatus = ref(true)
  for (let key in form) {
    if (key === 'studentDegree') {
      if (form[key].toLowerCase() != 'undergraduate' && form[key].toLowerCase() != 'postgraduate') {
        normalNotification('Student Degree form: Not a Valid degree !!!!!', 'We are only accepting Undergraduate and Postgraduate students. Please check your spelling .')
        submitStatus.value = false;
      }else{
        updateProfile.value.studentDegree = form[key].toLowerCase()    // 统一下大小写
      }
    }
    if (key === 'auid'){
      console.log(isNaN(Number(form[key])))
      if ( isNaN(Number(form[key]))){
        normalNotification('AUID form: Not a Valid AUID !!!!!', 'Please check your AUID again.')
        submitStatus.value = false;
      }
    }
    if (key === 'email'){
      if (dialog_validated_email.value == false){
        normalNotification('Email form: Not a Valid code !!!!!', 'Please check your validation code from your email again.')
        submitStatus.value = false;
      }
    }


  }

  if (submitStatus.value == false) {
    errorNotification('Update Failed')
  }
  else{
    // const data = updateProfile.value
    put('api/currentUserProfile' , {
      data : updateProfile.value
    }).then((res) => {
      console.log(res.status)
      if (res.status == 1) {
        successNotification('Update Success')
        getUserProfile()
        dialogVisible.value = false;
      }else{
        errorNotification('Update Failed')
      }
    })
  }
}

async function check_email(email : string) {
  normalNotification('Sending an email to ' + email, 'Please wait for a few seconds')
  const respsone = await post('api/sendValidationEmail', {email: email})
  console.log(respsone)
  successNotification('Send email to '+ email +  'successfully. Please type the validation code, validation code will be expired in 5 minutes')
  // normalNotification('Sending email to '+ email, )
}


async function validValidationCode(email: string , code : string){
  const response = await post('/api/validateValidationCode/'+email+'/'+code)
  console.log(response)
  console.log(response['status'])
  if (response['status'] === 1){
    successNotification('Validation Code is correct')
    dialog_validated_email.value = true;
  }
  else{
    errorNotification( code + ' Code is incorrect')
  }
}


// 初始化数值， 在打开dialog的时候， 会调用这个函数
const dialog_openEvent = () =>{
  dialog_update_name.value = true;
  dialog_update_email.value = true;
  dialog_update_upi.value = true;
  dialog_update_auid.value = true;
  dialog_update_enrolDetails.value = true;
  dialog_update_studentDegree.value = true;
  dialog_check_email.value = false;
  validationCode.value = ''
  dialog_validated_email.value = false;

  fileBase_cv.value = ''
  fileList_cv.value = []

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


async function testUPloadCV() {
  if (fileBase_cv.value == ''){
    errorNotification('Please upload your CV')
  }
  else{
    await post('/api/getCV/' + detil.value.id, {"cv": fileBase_cv.value})
    successNotification('uploading your CV successfully')
    dialog_upload_cv.value = false;
  }
}


const fileList_ad = ref<UploadUserFile[]>([]);
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


async function testUPloadAD() {
  if (fileBase_ad.value == ''){
    errorNotification('Please upload your application document')
  }
  else{
    await post('/api/getAcademicTranscript/' + detil.value.id, {"AcademicTranscript": fileBase_ad.value})
    successNotification('uploading your Academic transcript successfully')
    dialog_upload_ad.value = false;
  }

}


// -------------------- update profile -------------------- end
</script>

<template>
    <!-- below are presented using Mock data -->
    <div class="profile-container">
        <div class="profile-avatar">
            <img src="@/assets/avatar.svg" alt="avatar" />
        </div>

        <div class="profile-info">
            <div class="profile-info-general">

                <div>{{ detil.name }}</div>

                <div>{{detil.email}}</div>
            </div>

            <div class="profile-info-details">
                <h2>Infomation</h2>
                <pre>UPI:                      {{detil.upi}}</pre>
                <pre>AUID:                   {{detil.auid}}</pre>
                <pre>Preferred Email:   {{ detil.email}}</pre>
              <div v-if="detil.currentlyOverseas===null">
                <pre>Currently Overseas:  Unknown</pre>
              </div>
              <div v-else-if="detil.currentlyOverseas===true">
                <pre>Currently Overseas:  Yes</pre>
              </div>
              <div v-else-if="detil.currentlyOverseas===false">
                <pre>Currently Overseas:  No</pre>
              </div>


              <div v-if="detil.enrolDetails===null">
                <pre>Enrol Detail:  Unknown</pre>
              </div>
              <div v-else>
                <pre>Enrol Detail:  {{ detil.enrolDetails }}</pre>
              </div>

              <div v-if="detil.studentDegree===null">
                <pre>Degree:  Unknown</pre>
              </div>
              <div v-else>
                <pre>Degree:  {{ detil.studentDegree }}</pre>
              </div>

            </div>
        </div>

        <div class="profile-download">
            <p>Personal documents</p>
<!--            <div>visa.pdf</div>-->
            <div @click="getCV">cv</div>
            <div @click="getAcademicRecord">Academic Transcript</div>
          <el-button @click="showUploadDialog" >
            Upload<el-icon class="el-icon--right"><Upload/></el-icon>
          </el-button>
        </div>

    </div>

    <el-button class="profile-update" @click="showDiaglog">Update profile</el-button>
<!--    <el-button class="profile-update" @click="">Change Password</el-button>-->

  <el-dialog v-model="dialogUploadVisible" title="Upload File"  class="dialog-Upload-container" >
    <el-button @click="dialog_upload_cv=true" v-if="dialog_upload_cv===false">Upload CV</el-button>
    <el-button @click="dialog_upload_ad=true" v-if="dialog_upload_ad===false">Upload Academic transcript</el-button>


    <div>
    <div class="dialog-upload-ad" v-if="dialog_upload_ad===true">
      <p>Upload your Academic transcript</p>
      <div>
        <el-upload
            :limit = "1"
            ref="upload_cv"
            accept="application/pdf"
            v-model:file-list="fileList_ad"
            :on-change="handleChange_ad"
            :on-exceed="handleExceed_ad"
            :on-remove="handleRemove_ad"
            action = ""
            drag>
          <el-icon class="el-icon--upload">
            <upload-filled/>
          </el-icon>
          <div class="el-upload__text">
            Drop your Academic transcript here or <em>click to upload</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              Require: PDF files with a size less than 2MB
            </div>
          </template>

        </el-upload>
        <div>
          <el-button @click="testUPloadAD">Test</el-button>
          <el-button @click="dialog_upload_ad=false">Cancel</el-button>
        </div>
      </div>
    </div>

    </div>
    <el-divider></el-divider>
    <div>
    <div class="dialog-upload-cv" v-if="dialog_upload_cv===true">
      <p>Upload your cv</p>
      <div>
        <el-upload
            :limit = "1"
            ref="upload_cv"
            accept="application/pdf"
            v-model:file-list="fileList_cv"
            :on-change="handleChange_cv"
            :on-exceed="handleExceed_cv"
            :on-remove="handleRemove_cv"
            action = ""
            drag>
          <el-icon class="el-icon--upload">
            <upload-filled/>
          </el-icon>
          <div class="el-upload__text">
            Drop your CV here or <em>click to upload</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              Require: PDF files with a size less than 2MB
            </div>
          </template>

        </el-upload>
      </div>
      <div>
        <el-button @click="testUPloadCV">Test</el-button>
        <el-button @click="dialog_upload_cv=false">Cancel</el-button>
      </div>
    </div>
    </div>
  </el-dialog>


    <el-dialog v-model="dialogVisible" title="Quick Update"  class="dialog-container" >
      <el-header>
        <el-button @click="dialog_update_name=true" v-if="dialog_update_name===false">update name</el-button>
        <el-button @click="dialog_update_email=true" v-if="dialog_update_email===false">update email</el-button>
        <el-button @click="dialog_update_upi=true" v-if="dialog_update_upi===false">update upi</el-button>
        <el-button @click="dialog_update_auid=true" v-if="dialog_update_auid===false">update auid</el-button>
        <el-button @click="dialog_update_enrolDetails=true" v-if="dialog_update_enrolDetails===false">update enrol details </el-button>
        <el-button @click="dialog_update_studentDegree=true" v-if="dialog_update_studentDegree===false">update student degree</el-button>
      </el-header>
      <el-form :label-position="left" :model="updateProfile" >

        <div class="dialog-update-name" v-if="dialog_update_name===true">
          <el-form-item
              label="Name"
              prop="name"
            :rules="{
            required: true,
            message: 'name can not be empty',
            trigger: 'blur',
          }">
            <el-input v-model="updateProfile.name" :placeholder="`origin:  ${detil.name}`" ></el-input>
            <el-button @click="dialog_update_name=false; delete updateProfile.name">cancel</el-button>
          </el-form-item>

        </div>


        <div class="dialog-update-email" v-if="dialog_update_email===true">
          <el-form-item
              label="Email"
              prop="email"
              :rules="{
            required: true,
            message: 'Email can not be empty',
            trigger: 'blur',
          }" >
            <el-input v-model="updateProfile.email" :placeholder="`origin:  ${detil.email}`"></el-input>
            <div v-if="dialog_check_email===true">
              <el-input v-model="validationCode" placeholder="Validation Code" ></el-input>

            </div>

            <el-button @click="dialog_check_email=true; check_email(updateProfile.email)" >Check Email</el-button>
            <el-button @click="validValidationCode(updateProfile.email, validationCode)" v-if="dialog_check_email===true">Valid the code</el-button>
            <el-button @click="dialog_update_email=false; delete updateProfile.email">cancel</el-button>
          </el-form-item>
        </div>


        <div class="dialog-update-upi" v-if="dialog_update_upi===true">
          <el-form-item
              label="UPI"
              prop="UPI"
              :rules="{
            required: true,
            message: 'UPI can not be empty',
            trigger: 'blur',
          }" >
            <el-input v-model="updateProfile.upi" :placeholder="`origin:  ${detil.upi}`" ></el-input>
            <el-button @click="dialog_update_upi=false; delete updateProfile.upi">cancel</el-button>
          </el-form-item>
        </div>


        <div class="dialog-update-auid" v-if="dialog_update_auid===true">
          <el-form-item
              label="AUID"
              :prop="Number === true"
              :rules="{
            required: true,
            message: 'auid can not be empty and auid must be a number',
            trigger: 'blur',
          }" >
            <el-input v-model="updateProfile.auid" :placeholder="`Note auid must be a number. origin:  ${detil.auid}`" ></el-input>
            <el-button @click="dialog_update_auid=false; delete updateProfile.auid">cancel</el-button>
          </el-form-item>
        </div>


        <div class="dialog-update-enrolDetails" v-if="dialog_update_enrolDetails===true">
          <el-form-item
              label="Enrol Details"
              :rules="{
            required: true,
            message: 'Enrol details can not be empty',
            trigger: 'blur',
          }" >
            <el-input v-model="updateProfile.enrolDetails" :placeholder="`origin:  ${detil.enrolDetails}`" ></el-input>
            <el-button @click="dialog_update_enrolDetails=false; delete updateProfile.enrolDetails">cancel</el-button>
          </el-form-item>
        </div>


        <div class="dialog-update-studentDegree" v-if="dialog_update_studentDegree===true">
          <el-form-item
              label="Student Degree"
              :rules="{
            required: true,
            message: 'Student degree can not be empty',
            trigger: 'blur',
          }" >
            <el-input v-model="updateProfile.studentDegree" :placeholder="`origin:  ${detil.studentDegree}`" ></el-input>
            <el-button @click="dialog_update_studentDegree=false; delete updateProfile.studentDegree">cancel</el-button>
          </el-form-item>
        </div>

      </el-form>
    <el-footer class="dialog-footer"><el-button @click="showinfo">Test</el-button>
      <el-button @click="submitUpdateForm(updateProfile)">submit</el-button></el-footer>

    </el-dialog>
    
</template>

<style scoped lang="scss">
.dialog-container{
  width: 70%;
  height: 70%;

}

.profile-update{
    padding: 20px 60px;
    font-size: 20px;
    width: 160px;
    margin-left: 180px;
}
.profile-container {
    margin: 40px 60px;
    display: flex;
    .profile-avatar {
        width: 80px;
        margin-right: 40px;
    }

    .profile-info {
        &-general {
            font-size: 25px;
            font-weight: 600;
            :last-child {
                font-size: 20px;
                font-weight: 500;
            }
        }

        &-details {
            margin-top: 30px;
            h2 {
                font-size: 20px;
            }

            pre {
                padding-left: 10px;
                font-size: 16px;
                color: #aaa;
            }
        }
    }

    .profile-download {
        margin-left: auto;
        align-self: flex-start;
        p {
            font-size: 20px;
            border-bottom: 1px solid rgb(233, 233, 233);
        }

        div {
            font-size: 16px;
            margin-left: 20px;
            color:rgb(160, 211, 253);
            cursor:pointer;
        }
        div:hover {
            color:rgb(109, 189, 254);
        }
    }

}
</style>