<template>
  <div class="page-container">
    <el-row :gutter="15" style="margin-bottom: 20px;">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>Endorse Applicants</span>
            </div>
          </template>
          <applicant-list :course-id="($route.params.courseId as string)"/>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="15">
      <el-col :md="12" :xs="24">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>Course Information</span>
              <el-button type="primary" :icon="Edit" @click="courseEditModalOpened = true" circle/>
            </div>
          </template>
          <el-descriptions
              title="Basic Information"
              direction="vertical"
              :column="4"
              border
          >
            <el-descriptions-item label="Course Name" :span="2">{{ courseInformation.courseName }}
            </el-descriptions-item>
            <el-descriptions-item label="Term">
              <el-tag effect="dark">{{ courseInformation.termName }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="Estimated Num Of Students">{{ courseInformation.estimatedNumOfStudents }}
            </el-descriptions-item>
            <el-descriptions-item label="Currently Num Of Students">{{ courseInformation.currentlyNumOfStudents }}
            </el-descriptions-item>
            <el-descriptions-item label="Num Of Assignments">{{ courseInformation.numOfAssignments }}
            </el-descriptions-item>
            <el-descriptions-item label="Num Of Labs Per Week">{{ courseInformation.numOfLabsPerWeek }}
            </el-descriptions-item>
            <el-descriptions-item label="Num Of Tutorials Per Week">{{ courseInformation.numOfTutorialsPerWeek }}
            </el-descriptions-item>
          </el-descriptions>
          <br/>
          <el-descriptions
              title="Application Information"
              direction="vertical"
              :column="4"
              border
          >
            <el-descriptions-item label="Need Markers" >
              <p v-if="courseInformation.needMarkers">
                Yes
              </p>
              <p v-else>
                No
              </p>
            </el-descriptions-item>
            <el-descriptions-item label="Need Tutors">
              <p v-if="courseInformation.needTutors">
                Yes
              </p>
              <p v-else>
                No
              </p>
            </el-descriptions-item>
            <el-descriptions-item label="Total Available Hours">{{ courseInformation.totalAvailableHours }}
            </el-descriptions-item>
            <el-descriptions-item label="Can Pre Assign">
              <p v-if="courseInformation.canPreAssign">
                Yes
              </p>
              <p v-else>
                No
              </p>
            </el-descriptions-item>
            <el-descriptions-item label="Application DeadLine">{{ courseInformation.deadLine }}</el-descriptions-item>
            <el-descriptions-item label="Prerequisite" :span="3">{{ courseInformation.prerequisite }}
            </el-descriptions-item>
            <el-descriptions-item label="Tutor Responsibility" :span="4">{{ courseInformation.tutorResponsibility }}
            </el-descriptions-item>
            <el-descriptions-item label="Marker Responsibility" :span="4">{{ courseInformation.markerResponsibility }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>

      <el-col :md="12" :xs="24">
        <el-row :gutter="15">
          <el-col :span="24">
            <el-card class="box-card">
              <template #header>
                <div class="card-header">
                  <span>Pre Assign Markers & Tutors</span>
                </div>
              </template>
              <p class="emphasis">If you wish to assign students who are not register in the system: </p>
              <el-row justify="center">
                <el-button size="large" type="warning" @click="$router.push('/manageuser/batch-invite-user')" round>
                  Invite User
                </el-button>
              </el-row>
              <br/>
              <p class="emphasis">If they are already users of the system: </p>
              <el-row justify="center">
                <el-button size="large" type="primary" @click="enrollUserModalOpened = true" round>Enroll to the
                  Course
                </el-button>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="24">
            <el-card class="box-card">
              <template #header>
                <div class="card-header">
                  <span>Current Markers & Tutors</span>
                </div>
              </template>

              <p class="emphasis">Markers</p>
              <el-table
                  :data="currentMarkerList"
                  style="width: 100%"
                  v-loading="currentMarkerLoading">
                <el-table-column label="ID" prop="id" width="90"/>
                <el-table-column label="Email" prop="email" width="210"/>
                <el-table-column label="Name" prop="name" width="150"/>
                <el-table-column label="UPI" prop="upi" width="80"/>
                <el-table-column label="AUID" prop="auid"/>
              </el-table>

              <p class="emphasis">Tutors</p>
              <el-table
                  :data="currentTutorList"
                  style="width: 100%"
                  v-loading="currentTutorLoading">
                <el-table-column label="ID" prop="id" width="90"/>
                <el-table-column label="Email" prop="email" width="210"/>
                <el-table-column label="Name" prop="name" width="150"/>
                <el-table-column label="UPI" prop="upi" width="80"/>
                <el-table-column label="AUID" prop="auid"/>
              </el-table>


            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

  </div>


  <el-dialog v-model="courseEditModalOpened" title="Edit Course Information" width="60%" top="5vh"
             v-loading="editCourseLoading">
    <div class="modal-container">
      <div class="course-modal">
        <el-form ref="courseEditRef" :model="courseCCForm" label-width="220px">
          <div class="modal-content">
            <el-form-item label="Course Name" prop="courseName">
              <el-input v-model="courseCCForm.courseName" placeholder=""/>
            </el-form-item>
            <el-row>
              <el-form-item label="Can be preassigned" prop="canPreAssign" label-width="220px">
                <el-switch v-model="courseCCForm.canPreAssign" class="ml-2" inline-prompt
                           style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                           active-text="Y" inactive-text="N"/>
              </el-form-item>
              <el-form-item label="Need markers" prop="needMarkers" label-width="150px">
                <el-switch v-model="courseCCForm.needMarkers" class="ml-2" inline-prompt
                           style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                           active-text="Y" inactive-text="N"/>
              </el-form-item>
              <el-form-item label="Need tutors" prop="needTutors" label-width="150px">
                <el-switch v-model="courseCCForm.needTutors" class="ml-2" inline-prompt
                           style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                           active-text="Y" inactive-text="N"/>
              </el-form-item>
            </el-row>
            <el-form-item label="Estimated number of students" prop="estimatedNumOfStudents">
              <el-input-number v-model.number="courseCCForm.estimatedNumOfStudents" placeholder=""/>
            </el-form-item>

            <el-form-item label="Current number of students" prop="currentlyNumOfStudents">
              <el-input-number v-model.number="courseCCForm.currentlyNumOfStudents" placeholder=""/>
            </el-form-item>

            <el-form-item label="Number of Tutorials per week" prop="numOfTutorialsPerWeek">
              <el-input-number v-model.number="courseCCForm.numOfTutorialsPerWeek" placeholder=""/>
            </el-form-item>

            <el-form-item label="Number of Labs per week" prop="numOfLabsPerWeek">
              <el-input-number v-model.number="courseCCForm.numOfLabsPerWeek" placeholder=""/>
            </el-form-item>

            <el-form-item label="Number of assignments" prop="numOfAssignments">
              <el-input-number v-model.number="courseCCForm.numOfAssignments" placeholder=""/>
            </el-form-item>

            <el-form-item label="Total available hours" prop="totalAvailableHours">
              <el-input-number v-model.number="courseCCForm.totalAvailableHours" placeholder="">
                <template #append>hours</template>
              </el-input-number>
            </el-form-item>
            <el-form-item label="Prerequisite" prop="prerequisite">
              <el-input v-model="courseCCForm.prerequisite" autosize type="textarea"
                        placeholder="Please input"/>
            </el-form-item>
            <el-form-item label="Marker responsibility" prop="markerResponsibility">
              <el-input v-model="courseCCForm.markerResponsibility" autosize type="textarea"
                        placeholder="Please input"/>
            </el-form-item>
            <el-form-item label="Tutor responsibility" prop="tutorResponsibility">
              <el-input v-model="courseCCForm.tutorResponsibility" autosize type="textarea"
                        placeholder="Please input"/>
            </el-form-item>
          </div>
          <div class="modal-btns">
            <el-form-item>
              <el-button type="primary" @click="handleCourseEdit">Edit course</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </el-dialog>

  <el-drawer v-model="enrollUserModalOpened" title="Enroll to the Course" size="50%" direction="rtl" @close="enrolDrawerCloseEvent">

    <p class="emphasis">Find Users</p>
    <el-input
        v-model="userIDSearch"
        class="w-50 m-2"
        placeholder="Search Users by ID, Email, Name, UPI or AUID"
        style="margin-bottom: 10px"
        :prefix-icon="Search"
        @input="handleUserSearch"
    />

    <el-table :data="userTableData" style="width: 100%" v-loading="tableLoading" empty-text="Please Search User First !">
      <el-table-column label="ID" prop="id"/>
      <el-table-column label="Email" prop="email"/>
      <el-table-column label="Name" prop="name"/>
      <el-table-column label="UPI" prop="upi"/>
      <el-table-column label="AUID" prop="auid"/>
      <el-table-column align="right">
        <template #default="scope">
          <el-popover placement="left" :width="255" :visible="enrollPopoverVisible[scope.$index]" trigger="click">
            <OnClickOutside @trigger="enrollPopoverVisible[scope.$index] = false">
              <p style="font-weight: bold">Enroll {{ scope.row.id }}</p>
              <div style="display: flex; justify-content: center; flex-direction: column">
                <el-select v-model="currentRole" class="m-2" placeholder="Select Role"
                           style="margin-top: 7px; margin-bottom: 7px" :teleported="false">
                  <el-option
                      key="marker"
                      label="Marker"
                      value="marker"
                  />
                  <el-option
                      key="tutor"
                      label="Tutor"
                      value="tutor"
                  />
                </el-select>
                <el-input-number placeholder="Estimated Working Hours" v-model="currentEstimatedHours" :min="0"
                                 :step="1"
                                 style="margin-top: 3px; margin-bottom: 7px; width: 100%" controls-position="right"/>
              </div>
              <div style="text-align: right; margin: 0">
                <el-button size="small" type="primary" @click="handleEnrollUser(scope.row)" :loading="enrolmentLoading">confirm</el-button>
              </div>
            </OnClickOutside>
            <template #reference>
              <el-button size="small" @click="enrollPopoverVisible[scope.$index] = true">Enroll</el-button>
            </template>
          </el-popover>
        </template>
      </el-table-column>

    </el-table>


    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="enrollUserModalOpened = false">Close</el-button>
      </span>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import {Edit, Search} from '@element-plus/icons-vue';
import {onMounted, reactive, ref} from 'vue';
import {get, post, put} from "@/utils/request";
import {useRoute} from "vue-router";
import {ElMessage} from "element-plus";
import {useAsyncState} from "@vueuse/core";
import {OnClickOutside} from '@vueuse/components'
import ApplicantList from '@/components/applicationUseful/ApplicantList.vue';


const enrolDrawerCloseEvent = () => {
  userTableData.value = [];
  userIDSearch.value = '';
  enrollPopoverVisible.value = [];
  currentRole.value = '';
  currentEstimatedHours.value = null;
}

const enrollPopoverVisible = ref([]);
const popoverRef = ref(null);
const selectRoleRef = ref(null);
const route = useRoute();
const courseEditModalOpened = ref(false);




type courseFormCCType = {
  needTutors: boolean;
  estimatedNumOfStudents: null | number;
  numOfTutorialsPerWeek: null | number;
  canPreAssign: boolean;
  numOfAssignments: null | number;
  markerResponsibility: string;
  courseName: string;
  tutorResponsibility: string;
  numOfLabsPerWeek: null | number;
  totalAvailableHours: null | number;
  needMarkers: boolean;
  currentlyNumOfStudents: null | number;
  prerequisite: string;
}


const courseCCForm = reactive<courseFormCCType>({
  needTutors: false,
  estimatedNumOfStudents: null,
  numOfTutorialsPerWeek: null,
  canPreAssign: false,
  numOfAssignments: null,
  markerResponsibility: '',
  courseName: '',
  tutorResponsibility: '',
  numOfLabsPerWeek: null,
  totalAvailableHours: null,
  needMarkers: false,
  currentlyNumOfStudents: null,
  prerequisite: '',
})

const courseInformation = ref({} as any)
const editCourseLoading = ref(false)

const handleCourseEdit = () => {
  editCourseLoading.value = true;
  put(`/api/courseManagement/${route.params.courseId}`, {data: courseCCForm}).then(() => {
    getCourseInfo();
  }).then(() => {
    courseEditModalOpened.value = false;
    ElMessage({
      message: `Edit success.`,
      type: 'success',
    })
    editCourseLoading.value = false;
  }).catch(err => {
    if (err.response.data) {
      ElMessage({
        message: err.response.data.message,
        type: 'error',
      })
    } else {
      ElMessage({
        message: 'Oops, something went wrong.',
        type: 'error',
      })
    }
    console.error(err)
  })
}


const getCourseInfo = () => {
  get('api/getCourse/' + route.params.courseId).then((res) => {
    courseInformation.value = res
    courseCCForm.needTutors = res.needTutors
    courseCCForm.estimatedNumOfStudents = res.estimatedNumOfStudents
    courseCCForm.numOfTutorialsPerWeek = res.numOfTutorialsPerWeek
    courseCCForm.canPreAssign = res.canPreAssign
    courseCCForm.numOfAssignments = res.numOfAssignments
    courseCCForm.markerResponsibility = res.markerResponsibility
    courseCCForm.courseName = res.courseName
    courseCCForm.tutorResponsibility = res.tutorResponsibility
    courseCCForm.numOfLabsPerWeek = res.numOfLabsPerWeek
    courseCCForm.totalAvailableHours = res.totalAvailableHours
    courseCCForm.needMarkers = res.needMarkers
    courseCCForm.currentlyNumOfStudents = res.currentlyNumOfStudents
    courseCCForm.prerequisite = res.prerequisite

  })
}

getCourseInfo()


interface User {
  id: string
  email: string
  name: string
  upi: string
  auid: number
}

const enrollUserModalOpened = ref(false);
const userTableData = ref<Array<User>>([])
const tableLoading = ref(false)
const userIDSearch = ref('');


const getUser = () => {
  tableLoading.value = true
  get('api/searchUser/' + userIDSearch.value).then((res) => {
    userTableData.value = []
    res.forEach((item: User) => {
      userTableData.value.push({
        id: item.id,
        email: item.email,
        name: item.name,
        upi: item.upi,
        auid: item.auid
      })
    })
    tableLoading.value = false
  }).catch((e) => {
    console.log(e)
    tableLoading.value = false
  })
}


const handleUserSearch = () => {
  enrollPopoverVisible.value = []
  if (userIDSearch.value !== '') {
    getUser()
  }else {
    userTableData.value = []
  }
}


const currentMarkerList = ref([])
const currentMarkerLoading = ref(false)
const currentTutorList = ref([])
const currentTutorLoading = ref(false)

const {isLoading: isLoadingUser, state: stateUser, isReady: isReadyUser, execute: executeUser} = useAsyncState(
    (args) => {
      const courseID = route.params.courseId
      return get(`api/getCourseUser/${courseID}/true`);
    },
    [],
    {
      resetOnExecute: false,
      immediate: false
    },
)


const getCurrentMarkerTutorList = () => {
  currentMarkerLoading.value = true
  currentTutorLoading.value = true
  executeUser().then(() => {
    currentMarkerList.value = stateUser.value.filter((user: { roleInCourse: string; }) => user.roleInCourse === 'marker')
    currentTutorList.value = stateUser.value.filter((user: { roleInCourse: string; }) => user.roleInCourse === 'tutor')
    currentMarkerLoading.value = false
    currentTutorLoading.value = false
  })
}


getCurrentMarkerTutorList()


const currentRole = ref()
const currentEstimatedHours = ref()
const enrolmentLoading = ref(false)

const handleEnrollUser = (row: User) => {
  enrolmentLoading.value = true
  if (!currentRole.value || !currentEstimatedHours.value) {
    ElMessage({
      message: 'Please select a role and input estimated hours.',
      type: 'error',
    })
    enrolmentLoading.value = false
    return
  }
  post(`api/enrolment`, {
    courseID: route.params.courseId,
    userID: row.id,
    role: currentRole.value,
    estimatedHours: currentEstimatedHours.value
  }).then(() => {
    ElMessage({
      message: `Enroll success.`,
      type: 'success',
    })
    getCurrentMarkerTutorList()
    currentRole.value = ''
    currentEstimatedHours.value = null
    enrolmentLoading.value = false
    enrollPopoverVisible.value = []
  }).catch(err => {
    if (err.response.data) {
      ElMessage({
        message: err.response.data.message,
        type: 'error',
      })} else {
      ElMessage({
        message: 'Oops, something went wrong.',
        type: 'error',
      })}
    console.error(err)
    enrolmentLoading.value = false
  })
}

onMounted(() => {
  enrollPopoverVisible.value = []
})


</script>

<style scoped lang="scss">

.page-container {
  margin: 15px 30px 15px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.emphasis {
  font-weight: bold;
  margin-bottom: 20px;
}

.box-card {
  margin-bottom: 15px;
}


</style>