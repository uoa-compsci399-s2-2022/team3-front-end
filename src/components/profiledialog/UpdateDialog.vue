<script setup lang="ts">
import {ref} from "vue";
import {get, post} from "@/utils/request";
import { warningNotification, errorNotification, normalNotification, successNotification } from '@/utils/notification';
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
} from '@element-plus/icons-vue'
import ValidateEmail from '@/components/profiledialog/ValidateEmail.vue'
type usertype = {
  id: string;
  name? : string
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

const detail = ref({} as usertype)
const updateDetail = ref({} as usertype)


async function getUserProfile() {
  let user = await get(`api/currentUserProfile`)
  detail.value['id'] = user.id
  detail.value['name'] = user.name;
  detail.value['email'] = user.email;
  detail.value['upi'] = user.upi;
  detail.value['auid'] = user.auid;
  detail.value['currentlyOverseas'] = user.currentlyOverseas ;
  detail.value['willBackToNZ'] = user.willBackToNZ;
  detail.value['isCitizenOrPR'] = user.isCitizenOrPR;
  detail.value['haveValidVisa'] = user.haveValidVisa;
  detail.value['enrolDetails'] = user.enrolDetails;
  detail.value['studentDegree'] = user.studentDegree;
  detail.value['haveOtherContracts'] = user.haveOtherContracts;
  detail.value['otherContracts'] = user.otherContracts;
  detail.value['maximumWorkingHours'] = user.maximumWorkingHours;

}


// ----------steps----------- start

const active = ref(1)
const showInfo = ref(true)
const showContact = ref(false)
const next = () => {
  if (active.value++ > 1) active.value = 1
  currentstep(active.value)
}
const currentstep = (step: number) => {
  if (step == 1) {
    showInfo.value = true
    showContact.value = false
  } else if (step == 2) {
    showInfo.value = false
    showContact.value = true
  }
}
// ----------steps----------- end


// ----------check email----------- start
const validationCode = ref('')

const showvalidationForm = ref(false)

async function check_email(email : string) {
  showvalidationForm.value = true

  // normalNotification('Sending an email to ' + email, 'Please wait for a few seconds')
  // const respsone = await post('api/sendValidationEmail', {email: email})
  // console.log(respsone)
  // successNotification('Send email to '+ email +  'successfully. Please type the validation code, validation code will be expired in 5 minutes')
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


// ----------check email----------- start

const dialog_update_name = ref(false);
const dialog_update_email = ref(false);
const dialog_update_upi = ref(false);
const dialog_update_auid = ref(false);
const dialog_update_enrolDetails = ref(false);
const dialog_update_studentDegree = ref(false);
const dialog_check_email = ref(false);
const dialog_validated_email = ref(false);

const handleValidationCode = ref()

getUserProfile()
</script>

<template>
  <el-steps  :active="active" simple>
    <el-step title="Basic Information" description="Basic Information" ></el-step>
    <el-step title="Contact Information" description="Basic Information" ></el-step>
<!--    <el-step title="Step 3" description="Basic Information" ></el-step>-->
  </el-steps>


  <el-button style="margin-top: 12px" @click="next">Next step</el-button>
  <el-button style="margin-top: 12px" @click="next">Previous step</el-button>
  <div class="dialog-container" v-if="showInfo===true" >
    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="dialog-card-header">
          <p >Basic info</p>
        </div>
      </template>
      <div class="dialog-contain">
        <div class="dialog-contain-name-info">
          <span class="subject">NAME</span>
        </div>
        <div class="dialog-contain-name-info">
          <span class="detail" v-if="dialog_update_name===false">{{detail.name}}</span>
          <span class="update-detail" v-if="dialog_update_name===true">
            <el-input v-model="updateDetail.name" :placeholder="`origin:  ${detail.name}`"></el-input>
          </span>
        </div>
        <div class="dialog-contain-name-info" style=" justify-self: right;">
          <el-button type="primary" @click="dialog_update_name=true" v-if="dialog_update_name===false">Update</el-button>
          <el-button type="danger" @click="dialog_update_name=false; delete updateDetail.name" v-if="dialog_update_name===true">Cancel</el-button>
          <el-button type="success" :icon="Check" @click="" v-if="dialog_update_name===true"></el-button>
        </div>
      </div>
      <el-divider></el-divider>
<!--      <div class="dialog-contain">-->
<!--        <div class="dialog-contain-name-info">-->
<!--          <span class="subject">EMAIL</span>-->
<!--        </div>-->
<!--        <div class="dialog-contain-name-info">-->
<!--          <span class="detail" v-if="dialog_update_email===false">{{detail.email}}</span>-->
<!--          <span class="update-detail" v-if="dialog_update_email===true">-->
<!--            <el-input v-model="updateDetail.email" :placeholder="`origin:  ${detail.email}`"></el-input>-->
<!--          </span>-->
<!--        </div>-->
<!--        <div class="dialog-contain-name-info"  style="justify-self: right;">-->
<!--          <el-button type="primary" @click="dialog_update_email=true" v-if="dialog_update_email===false">Update</el-button>-->
<!--          <el-button type="danger" @click="dialog_update_email=false; delete updateDetail.name" v-if="dialog_update_email===true">Cancel</el-button>-->
<!--          <el-button type="success" :icon="Check" @click="" v-if="dialog_update_email===true"></el-button>-->
<!--        </div>-->
<!--      </div>-->
<!--      <el-divider></el-divider>-->
      <div class="dialog-contain">
        <div class="dialog-contain-name-info">
          <span class="subject">UPI</span>
        </div>
        <div class="dialog-contain-name-info">
          <span class="detail" v-if="dialog_update_upi===false">{{detail.upi}}</span>
          <span class="update-detail" v-if="dialog_update_upi===true">
            <el-input v-model="updateDetail.upi" :placeholder="`origin:  ${detail.upi}`"></el-input>
          </span>
        </div>
        <div class="dialog-contain-name-info"  style=" justify-self: right;">
          <el-button type="danger" @click="warningNotification('You cannot change your UPI on yourself')" >Cannot update</el-button>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="dialog-contain">
        <div class="dialog-contain-name-info">
          <span class="subject">AUID</span>
        </div>
        <div class="dialog-contain-name-info">
          <span class="detail" v-if="dialog_update_auid===false">{{detail.auid}}</span>
          <span class="update-detail" v-if="dialog_update_auid===true">
            <el-input v-model="updateDetail.auid" :placeholder="`origin:  ${detail.auid}`"></el-input>
          </span>
        </div>
        <div class="dialog-contain-name-info"  style=" justify-self: right;">
          <el-button type="danger" @click="warningNotification('You cannot change your AUID on yourself')" >Cannot update</el-button>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="dialog-contain">
        <div class="dialog-contain-name-info">
          <span class="subject">Enrol Detail</span>
        </div>
        <div class="dialog-contain-name-info">
          <span class="detail" v-if="dialog_update_enrolDetails===false">{{detail.enrolDetails}}</span>
          <span class="update-detail" v-if="dialog_update_enrolDetails===true">
              <el-input v-model="updateDetail.enrolDetails" :placeholder="`origin:  ${detail.enrolDetails}`"></el-input>
          </span>
        </div>
        <div class="dialog-contain-name-info"  style="justify-self: right;">
          <el-button type="primary" @click="dialog_update_enrolDetails=true" v-if="dialog_update_enrolDetails===false">Update</el-button>
          <el-button type="danger" @click="dialog_update_enrolDetails=false; delete updateDetail.name" v-if="dialog_update_enrolDetails===true">Cancel</el-button>
          <el-button type="success" :icon="Check" @click="" v-if="dialog_update_enrolDetails===true"></el-button>
        </div>
      </div>

      <el-divider></el-divider>

    </el-card>
  </div>


<!--  Step 2 -->
  <div class="dialog-container" v-if="showContact===true" >
    <el-card class="box-card" shadow="never">
      <template #header>
        <div class="dialog-card-header">
          <p>Contact information</p>
        </div>
      </template>
      <div class="dialog-contain">
        <div class="dialog-contain-name-info">
          <span class="subject">EMAIL</span>
        </div>
        <div class="dialog-contain-name-info">
          <span class="detail" v-if="dialog_update_email===false">{{detail.email}}</span>
          <span class="update-detail" v-if="dialog_update_email===true">
            <el-input v-model="updateDetail.email" :placeholder="`origin:  ${detail.email}`"></el-input>
            <el-dialog v-model="showvalidationForm" center title="Please Enter your validation code">
              <validate-email ref="handleValidationCode"/>
            </el-dialog>
          </span>
        </div>
        <div class="dialog-contain-name-info"  style="justify-self: right;">
          <el-button type="primary" @click="dialog_update_email=true" v-if="dialog_update_email===false">Update</el-button>
          <el-button type="danger" @click="dialog_update_email=false; delete updateDetail.name" v-if="dialog_update_email===true">Cancel</el-button>
          <el-button type="success" :icon="Check" @click="check_email(updateDetail.email)" v-if="dialog_update_email===true"></el-button>
        </div>
      </div>
      <el-divider></el-divider>
    </el-card>

  </div>
  <div style="align-items: center;">
    <el-button style="">Test</el-button>
    <el-button style="">Submit Basic information</el-button>
  </div>
</template>

<style scoped lang="scss">


.dialog-card-header{
  height: 55px;
  font-size: 35px;
  width: inherit;
  font-family: serif;

}
.dialog-container[data-v-5e348609] {
  width: 100%;
  height: 70%;

}

.dialog-contain {
   /* padding: var(--el-card-padding); */
   height: 60px;
    display: grid;
    grid-template-columns: 150px auto auto;
    grid-gap: 20px;
    //background-color: #2196F3;
    padding: 10px;
    font-family: monospace;
    align-items: center;
  font-size: 25px;
  .subject{
    color: gray;
  }

 }

</style>