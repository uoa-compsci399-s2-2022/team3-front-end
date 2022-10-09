<script setup lang="ts">
import { ref } from 'vue';
import { get } from '@/utils/request'

const id = ref<string>();
const name = ref<string>();
const email = ref<string>();
const upi = ref<string>();
const auid = ref<string>();
const currentlyOverseas = ref<string>();
const willBackToNZ = ref<string>();
const isCitizenOrPR = ref<string>();
const haveValidVisa = ref<string>();
const enrolDetails = ref<string>();
const studentDegree = ref<string>();
const otherContracts = ref<string>();
const maximunWorking = ref<string>();
const academicRecord = ref<string>();
const cv = ref<string>();
const createDateTime = ref<string>();



var detil: { [key: string]: string; } = {
};

async function getUserProfile() {
  let user = await get(`api/currentUserProfile`)

    // let user = await get(`api/currentUserProfile`)
    // console.log(user)
    id.value = user.id;
    name.value = user.name;
    email.value = user.email;
    upi.value = user.upi;
    auid.value = user.auid;
    currentlyOverseas.value = user.currentlyOverseas;
    willBackToNZ.value = user.willBackToNZ;
    isCitizenOrPR.value = user.isCitizenOrPR;
    haveValidVisa.value = user.haveValidVisa;
    enrolDetails.value = user.enrolDetails;
    studentDegree.value = user.studentDegree;
    otherContracts.value = user.otherContracts;
    maximunWorking.value = user.maximumWorkingHours;
    createDateTime.value = user.createDateTime;
    //
    // detil['name'] = user.name;
    // detil['email'] = user.email;
    // detil['upi'] = user.upi;
    // detil['auid'] = user.auid;
    // detil['currentlyOverseas'] = user.currentlyOverseas ;
    // detil['willBackToNZ'] = user.willBackToNZ;
    // detil['isCitizenOrPR'] = user.isCitizenOrPR;
    // detil['haveValidVisa'] = user.haveValidVisa;
    // detil['enrolDetails'] = user.enrolDetails;
    // detil['studentDegree'] = user.studentDegree;
    // detil['haveOtherCont'] = user.haveOtherCont;
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
  let user = await get(`api/getAcademicTranscript/` + id.value)
  console.log(user.cv)
  if (user.AcademicTranscript != null && user.AcademicTranscript != undefined && user.AcademicTranscript != "") {
    academicRecord.value = user.AcademicTranscript;
    // let blob = base64toBlob(academicRecord.value, 'application/pdf');
    var Blob = base64ToBlob(academicRecord.value)
    let bloburl = window.URL.createObjectURL(Blob);
    window.open(bloburl);
  }else{
    alert("No Academic Record, please upload your Academic Record")
  }

}

async function getCV() {
  // console.log(id.value)
  let user = await get(`api/getCV/` + id.value)
  console.log(user.cv)
  if (user.cv != null && user.cv != undefined && user.cv != "") {
    academicRecord.value = user.cv;
    // let blob = base64toBlob(academicRecord.value, 'application/pdf');
    var Blob = base64ToBlob(academicRecord.value)
    let bloburl = window.URL.createObjectURL(Blob);

    window.open(bloburl);
  }
  else{
    alert("No CV uploaded, please upload your CV")
  }

}

getUserProfile()


</script>

<template>
    <!-- below are presented using Mock data -->
    <div class="profile-container">
        <div class="profile-avatar">
            <img src="@/assets/avatar.svg" alt="avatar" />
        </div>

        <div class="profile-info">
            <div class="profile-info-general">

                <div>{{name}}</div>

                <div>{{ name }}</div>

                <div>{{email}}</div>
            </div>

            <div class="profile-info-details">
                <h2>Infomation</h2>
                <pre>UPI:                      {{upi}}</pre>
                <pre>AUID:                   {{auid}}</pre>
                <pre>Preferred Email:   {{email}}</pre>
              <div v-if="currentlyOverseas===null">
                <pre>Currently Overseas:  Unknown</pre>
              </div>
              <div v-else-if="currentlyOverseas===true">
                <pre>Currently Overseas:  Yes</pre>
              </div>
              <div v-else-if="currentlyOverseas===false">
                <pre>Currently Overseas:  No</pre>
              </div>


              <div v-if="enrolDetails===null">
                <pre>Enrol Detail:  Unknown</pre>
              </div>
              <div v-else>
                <pre>Enrol Detail:  {{ enrolDetails }}</pre>
              </div>

              <div v-if="studentDegree===null">
                <pre>Degree:  Unknown</pre>
              </div>
              <div v-else>
                <pre>Degree:  {{ studentDegree }}</pre>
              </div>

            </div>
        </div>

        <div class="profile-download">
            <p>Personal documents</p>
<!--            <div>visa.pdf</div>-->
            <div @click="getCV">cv

            </div>
            <div @click="getAcademicRecord">Academic Transcript</div>
        </div>
    </div>
    
    <el-button class="profile-update">Update profile</el-button>

    
</template>

<style scoped lang="scss">
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