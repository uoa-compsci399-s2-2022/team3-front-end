<template>
  <div class="page-container">
    <el-row :gutter="15">
      <el-col :md="12" :xs="24">
        <el-card class="box-card">
          <el-descriptions
              title="Course Information"
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
            <el-descriptions-item label="Workload">{{ estimateworkload.workload }}
            </el-descriptions-item>
<!--            <el-descriptions-item label="Submit workload">-->
<!--              <el-input v-model="inputWorkload.workload" style="width: 50%"></el-input>-->
<!--              <el-button @click="SubmitedWorkload" type="primary" style="float: right">Submit</el-button>-->
<!--            </el-descriptions-item>-->
          </el-descriptions>
        </el-card>
      </el-col>

      <el-col :md="12" :xs="24">
        <el-row :gutter="15">
          <el-col :span="24">
            <el-card class="box-card">
              <template #header>
                <div class="card-header">
                  <span>Members in {{courseInformation.courseNum}}</span>
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

              <p class="emphasis">Course Coordinator</p>
              <el-table
                  :data="currentCCList"
                  style="width: 100%"
                  v-loading="currentCCLoading">
                <el-table-column label="ID" prop="id"/>
                <el-table-column label="Email" prop="email"/>
                <el-table-column label="Name" prop="name"/>
              </el-table>


            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>





</template>

<script setup lang="ts">

import {reactive, ref} from 'vue';
import {get, put} from "@/utils/request";
import {useRoute} from "vue-router";
import {ElMessage} from "element-plus";
import {useAsyncState} from "@vueuse/core";


const route = useRoute();


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

const courseInformation = ref({} as any)

type inputWorkloadCCType = {
  workload:number
}
const inputWorkload = reactive<estimateworkloadCCType>({
  workload: 0
})
const SubmitedWorkload = () => {
  console.log(inputWorkload.workload)
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




const currentMarkerList = ref([])
const currentMarkerLoading = ref(false)
const currentTutorList = ref([])
const currentTutorLoading = ref(false)
const currentCCList = ref([])
const currentCCLoading = ref(false)

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


const getCurrentMarkerTutorCCList = () => {
  currentMarkerLoading.value = true
  currentTutorLoading.value = true
  currentCCLoading.value = true
  executeUser().then(() => {
    currentMarkerList.value = stateUser.value.filter((user: { roleInCourse: string; }) => user.roleInCourse === 'marker')
    currentTutorList.value = stateUser.value.filter((user: { roleInCourse: string; }) => user.roleInCourse === 'tutor')
    currentCCList.value = stateUser.value.filter((user: { roleInCourse: string; }) => user.roleInCourse === 'courseCoordinator')
    currentMarkerLoading.value = false
    currentTutorLoading.value = false
    currentCCLoading.value = false
  })
}

getCurrentMarkerTutorCCList()
const termID = route.params.termID

type estimateworkloadCCType = {
  workload:number
}
const estimateworkload = reactive<estimateworkloadCCType>({
  workload: 0
})
const getworkload =  () => {
   get('/api/getCurrentUserEnrollByTerm/' + termID).then(res => {
    res.forEach((item: any) => {
      if (item.courseID == route.params.courseId) {
        if (item.roleName === route.query.role){
          estimateworkload.workload = item.estimatedHours
        }
      }
    })
  })
}
getworkload()

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