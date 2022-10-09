<template>
  <div class="page-container">
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
            <el-descriptions-item label="Need Markers">{{ courseInformation.needMarkers }}</el-descriptions-item>
            <el-descriptions-item label="Need Tutors">{{ courseInformation.needTutors }}</el-descriptions-item>
            <el-descriptions-item label="Total Available Hours">{{ courseInformation.totalAvailableHours }}
            </el-descriptions-item>
            <el-descriptions-item label="Can Pre Assign">{{ courseInformation.canPreAssign }}</el-descriptions-item>
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
        <el-form ref="courseEditRef" :model="courseForm" label-width="220px">
          <div class="modal-content">
            <el-form-item label="Course Name" prop="courseName">
              <el-input v-model="courseForm.courseName" placeholder=""/>
            </el-form-item>
            <el-row>
              <el-form-item label="Can be preassigned" prop="canPreAssign" label-width="220px">
                <el-switch v-model="courseForm.canPreAssign" class="ml-2" inline-prompt
                           style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                           active-text="Y" inactive-text="N"/>
              </el-form-item>
              <el-form-item label="Need markers" prop="needMarkers" label-width="150px">
                <el-switch v-model="courseForm.needMarkers" class="ml-2" inline-prompt
                           style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                           active-text="Y" inactive-text="N"/>
              </el-form-item>
              <el-form-item label="Need tutors" prop="needTutors" label-width="150px">
                <el-switch v-model="courseForm.needTutors" class="ml-2" inline-prompt
                           style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                           active-text="Y" inactive-text="N"/>
              </el-form-item>
            </el-row>
            <el-form-item label="Estimated number of students" prop="estimatedNumOfStudents">
              <el-input v-model.number="courseForm.estimatedNumOfStudents" placeholder=""/>
            </el-form-item>

            <el-form-item label="Current number of students" prop="currentlyNumOfStudents">
              <el-input v-model.number="courseForm.currentlyNumOfStudents" placeholder=""/>
            </el-form-item>

            <el-form-item label="Number of Tutorials per week" prop="numOfTutorialsPerWeek">
              <el-input v-model.number="courseForm.numOfTutorialsPerWeek" placeholder=""/>
            </el-form-item>

            <el-form-item label="Number of Labs per week" prop="numOfLabsPerWeek">
              <el-input v-model.number="courseForm.numOfLabsPerWeek" placeholder=""/>
            </el-form-item>

            <el-form-item label="Number of assignments" prop="numOfAssignments">
              <el-input v-model.number="courseForm.numOfAssignments" placeholder=""/>
            </el-form-item>

            <el-form-item label="Total available hours" prop="totalAvailableHours">
              <el-input v-model.number="courseForm.totalAvailableHours" placeholder="">
                <template #append>hours</template>
              </el-input>
            </el-form-item>
            <el-form-item label="Prerequisite" prop="prerequisite">
              <el-input v-model="courseForm.prerequisite" autosize type="textarea"
                        placeholder="Please input"/>
            </el-form-item>
            <el-form-item label="Marker responsibility" prop="markerResponsibility">
              <el-input v-model="courseForm.markerResponsibility" autosize type="textarea"
                        placeholder="Please input"/>
            </el-form-item>
            <el-form-item label="Tutor responsibility" prop="tutorResponsibility">
              <el-input v-model="courseForm.tutorResponsibility" autosize type="textarea"
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

  <el-drawer v-model="enrollUserModalOpened" title="Enroll to the Course" size="50%" direction="rtl">

    <p class="emphasis">Find Users</p>
    <el-input
        v-model="userIDSearch"
        class="w-50 m-2"
        placeholder="Please Input User ID"
        style="margin-bottom: 10px"
        :prefix-icon="Search"
        @input="handleUserSearch"
    />

    <el-table :data="tableData" style="width: 100%" v-loading="tableLoading">
      <el-table-column label="ID" prop="id"/>
      <el-table-column label="Email" prop="email"/>
      <el-table-column label="Name" prop="name"/>
      <el-table-column label="UPI" prop="upi"/>
      <el-table-column label="AUID" prop="auid"/>
      <el-table-column align="right">
        <template #default="scope">
          <el-button size="small" @click="handleEnroll(scope.$index, scope.row)"
          >Enroll
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>


    <template #footer>
      <span class="dialog-footer">
        <el-button @click="enrollUserModalOpened = false">Cancel</el-button>
        <el-button type="primary" @click="enrollUserModalOpened = false"
        >Confirm</el-button
        >
      </span>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import {Check, Edit} from '@element-plus/icons-vue';
import {reactive, ref} from 'vue';
import {get, put} from "@/utils/request";
import {useRoute} from "vue-router";
import {ElMessage} from "element-plus";
import dayjs from "dayjs";
import {useAsyncState} from "@vueuse/core";

const route = useRoute();


const courseEditModalOpened = ref(false);


type courseFormCCType = {
  needTutors: boolean;
  estimatedNumOfStudents: string | number;
  numOfTutorialsPerWeek: string | number;
  canPreAssign: boolean;
  numOfAssignments: string | number;
  markerResponsibility: string;
  courseName: string;
  tutorResponsibility: string;
  numOfLabsPerWeek: string | number;
  totalAvailableHours: string | number;
  needMarkers: boolean;
  currentlyNumOfStudents: string | number;
  prerequisite: string;
}


const courseForm = reactive<courseFormCCType>({
  needTutors: false,
  estimatedNumOfStudents: '',
  numOfTutorialsPerWeek: '',
  canPreAssign: false,
  numOfAssignments: '',
  markerResponsibility: '',
  courseName: '',
  tutorResponsibility: '',
  numOfLabsPerWeek: '',
  totalAvailableHours: '',
  needMarkers: false,
  currentlyNumOfStudents: '',
  prerequisite: '',
})

const courseInformation = ref({})
const editCourseLoading = ref(false)

const handleCourseEdit = (row: number) => {
  editCourseLoading.value = true;
  put(`/api/courseManagement/${route.params.courseId}`, {data: courseForm}).then(() => {
    getCourseInfo();
  }).then(() => {
    courseEditModalOpened.value = false;
    ElMessage({
      message: `Edit success.`,
      type: 'success',
    })
    editCourseLoading.value = false;
  }).catch(err => {
    ElMessage({
      message: 'Oops. An error has occurred!',
      type: 'error',
    })
    editCourseLoading.value = false;
    console.error(err)
  })
}


const getCourseInfo = () => {
  get('api/getCourse/' + route.params.courseId).then((res) => {
    courseInformation.value = res

    courseForm.needTutors = res.needTutors
    courseForm.estimatedNumOfStudents = res.estimatedNumOfStudents
    courseForm.numOfTutorialsPerWeek = res.numOfTutorialsPerWeek
    courseForm.canPreAssign = res.canPreAssign
    courseForm.numOfAssignments = res.numOfAssignments
    courseForm.markerResponsibility = res.markerResponsibility
    courseForm.courseName = res.courseName
    courseForm.tutorResponsibility = res.tutorResponsibility
    courseForm.numOfLabsPerWeek = res.numOfLabsPerWeek
    courseForm.totalAvailableHours = res.totalAvailableHours
    courseForm.needMarkers = res.needMarkers
    courseForm.currentlyNumOfStudents = res.currentlyNumOfStudents
    courseForm.prerequisite = res.prerequisite

    console.log(courseInformation.value)
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
const tableData = ref<Array<User>>([])
const tableLoading = ref(false)
const userIDSearch = ref('');


const getUser = () => {
  tableLoading.value = true
  get('api/UserProfile/' + userIDSearch.value).then((res) => {
    tableData.value = []
    tableData.value.push({
      id: res.id,
      email: res.email,
      name: res.name,
      upi: res.upi,
      auid: res.auid
    })
    tableLoading.value = false
  }).catch((e) => {
    console.log(e)
    tableLoading.value = false
  })
}


const handleUserSearch = () => {
  getUser()
}


const currentMarkerList = ref([])
const currentMarkerLoading = ref(false)
const currentTutorList = ref([])
const currentTutorLoading = ref(false)

const {isLoading: isLoadingUser, state: stateUser, isReady: isReadyUser, execute: executeUser} = useAsyncState(
    (args) => {
      const courseID = route.params.courseId
      return get('api/getCourseUser/' + courseID);
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
    console.log(currentMarkerList.value)
    console.log(currentTutorList.value)
  })
}

getCurrentMarkerTutorList()


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