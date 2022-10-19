<template>
  <div class="page-container">
    <el-row style="align-items: center;">
      <el-col :md="12">
        <el-select v-model="selectedTerm" class="m-2" placeholder="Term" style="margin-right: 10px; margin-bottom: 5px"
                   v-loading="isLoadingTerm" no-data-text="No Term">
          <el-option
              v-for="item in stateTerm"
              :key="item.termID"
              :label="item.termName"
              :value="item.termID"
          />
        </el-select>
        <el-select v-model="tutorOrMarker" class="m-2" placeholder="Marker or Tutor">
          <el-option key="marker" label="Marker" value="marker" v-permission="7"/>
          <el-option key="tutor" label="Tutor" value="tutor" v-permission="6"/>
        </el-select>
      </el-col>
      <el-col :md="9">
        <el-alert title="Tips: Rows in the table can be expanded or clicked" type="info" show-icon/>
      </el-col>
      <el-col style="text-align: end" :md="3">
        <el-badge :value="stateNum.unpublished" type="primary" v-loading="isLoadingNum">
          <el-button type="success" size="large" @click="publishEvent">
            <font-awesome-icon style="margin-right: 4px; font-size: 20px" icon="fa-solid fa-bullhorn"/>
            Publish
          </el-button>
        </el-badge>

      </el-col>
    </el-row>
    <br/>

    <el-tabs tab-position="right" class="tabs" v-model="selectedTab" fixed="right">
      <el-tab-pane label="Pending">
        <template #label>
          <div :class="{selected_item: selectedTab==='0'}" class="tabs-label">
            <font-awesome-icon icon="fa-solid fa-file-circle-question"/> &nbsp;
            Pending
            <el-badge :value="stateNum.pending" type="warning"/>
          </div>
        </template>
        <ApprovalTable v-model:applicationApprovalList="statePendingApplication"
                       v-model:isLoading="isLoadingPendingApplication"
                       v-model:course="course"
                       v-model:isCourseLoading="isCourseLoading"
                       v-model:tutorOrMarker="tutorOrMarker"
                       v-model:tagIndex="selectedTab"
                       @reloadApplicationApprovalList="getApplicationApprovalList"/>
      </el-tab-pane>
      <el-tab-pane label="Accepted">
        <template #label>
          <div :class="{selected_item: selectedTab==='1'}" class="tabs-label">
            <el-icon>
              <CircleCheckFilled/>
            </el-icon> &nbsp;
            Accepted
            <el-badge :value="stateNum.accepted" type="success"/>
          </div>
        </template>
        <ApprovalTable v-model:applicationApprovalList="stateAcceptedApplication"
                       v-model:isLoading="isLoadingAcceptedApplication"
                       v-model:course="course"
                       v-model:isCourseLoading="isCourseLoading"
                       v-model:tutorOrMarker="tutorOrMarker"
                       v-model:tagIndex="selectedTab"
                       @reloadApplicationApprovalList="getApplicationApprovalList"/>
      </el-tab-pane>
      <el-tab-pane label="Rejected">
        <template #label>
          <div :class="{selected_item: selectedTab==='2'}" class="tabs-label">
            <el-icon>
              <CircleCloseFilled/>
            </el-icon> &nbsp;
            Rejected
            <el-badge :value="stateNum.rejected"/>
          </div>
        </template>
        <ApprovalTable v-model:applicationApprovalList="stateRejectedApplication"
                       v-model:isLoading="isLoadingRejectedApplication" v-model:course="course"
                       v-model:isCourseLoading="isCourseLoading" v-model:tutorOrMarker="tutorOrMarker"
                       v-model:tagIndex="selectedTab"
                       @reloadApplicationApprovalList="getApplicationApprovalList"/>
      </el-tab-pane>
      <el-tab-pane label="Published">
        <template #label>
          <div :class="{selected_item: selectedTab==='3'}" class="tabs-label">
            <font-awesome-icon icon="fa-solid fa-bullhorn"/> &nbsp;
            Published
            <el-badge :value="stateNum.published" type="primary"/>
          </div>
        </template>
        <ApprovalTable v-model:applicationApprovalList="statePublishedApplication"
                       v-model:isLoading="isLoadingPublishedApplication"
                       v-model:tagIndex="selectedTab"
                       v-model:course="course"
                       v-model:isCourseLoading="isCourseLoading" v-model:tutorOrMarker="tutorOrMarker"
                       @reloadApplicationApprovalList="getApplicationApprovalList"/>
      </el-tab-pane>
    </el-tabs>
  </div>

  <el-dialog
      v-model="publishDialogVisible"
      title="Publish confirmation"
      width="60%"
  >
      <el-table
          ref="publishTableRef"
          :data="publishTableData"
          style="width: 100%"
          @selection-change="handlePublishSelectionChange" v-loading="publishTableLoading"
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column property="applicationID" label="Application ID"/>
        <el-table-column property="status" label="Status" />
        <el-table-column property="name" label="Name"/>
        <el-table-column property="upi" label="UPI"/>
      </el-table>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="publishDialogVisible = false">Cancel</el-button>
        <el-button type="success" @click="submitPublishEvent"  v-loading="publishTableLoading" plain>Confirm</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script lang="ts" setup>
import {computed, ref, watch, reactive, onBeforeMount} from 'vue'
import {ElMessage, ElTable} from 'element-plus'
import type {TableColumnCtx} from 'element-plus/es/components/table/src/table-column/defaults'
import {useAsyncState} from "@vueuse/core";
import {get, post} from "@/utils/request";
import ApprovalTable from '@/components/applicationUseful/ApprovalTable.vue'
import {CircleCheckFilled, CircleCloseFilled} from '@element-plus/icons-vue'
import {usePermissionStore} from '@/store'

const selectedTerm = ref()
const tutorOrMarker = ref("")
const selectedTab = ref('0')


const {isLoading: isLoadingTerm, state: stateTerm, isReady: isReadyTerm, execute: executeTerm} = useAsyncState(
    (args) => {
      return get('api/term')
    },
    {},
    {
      resetOnExecute: false,
    },
)

const {
  isLoading: isLoadingPendingApplication,
  state: statePendingApplication,
  isReady: isReadyPendingApplication,
  execute: executePendingApplication
} = useAsyncState(
    (args) => {
      return get(`api/applicationListByTerm/${selectedTerm.value}/Pending/${tutorOrMarker.value}`)
    },
    [],
    {
      resetOnExecute: false,
      immediate: false
    },
)


const {
  isLoading: isLoadingAcceptedApplication,
  state: stateAcceptedApplication,
  isReady: isReadyAcceptedApplication,
  execute: executeAcceptedApplication
} = useAsyncState(
    (args) => {
      return get(`api/applicationListByTerm/${selectedTerm.value}/Accepted/${tutorOrMarker.value}`)
    },
    [],
    {
      resetOnExecute: false,
      immediate: false
    },
)


const {
  isLoading: isLoadingRejectedApplication,
  state: stateRejectedApplication,
  isReady: isReadyRejectedApplication,
  execute: executeRejectedApplication
} = useAsyncState(
    (args) => {
      return get(`api/applicationListByTerm/${selectedTerm.value}/Rejected/${tutorOrMarker.value}`)
    },
    [],
    {
      resetOnExecute: false,
      immediate: false
    },
)


const {
  isLoading: isLoadingPublishedApplication,
  state: statePublishedApplication,
  isReady: isReadyPublishedApplication,
  execute: executePublishedApplication
} = useAsyncState(
    (args) => {
      return get(`api/applicationListByTerm/${selectedTerm.value}/Published/${tutorOrMarker.value}`)
    },
    [],
    {
      resetOnExecute: false,
      immediate: false
    },
)

const {
  isLoading: isLoadingNum,
  state: stateNum,
  isReady: isReadyNum,
  execute: executeNum
} = useAsyncState(
    (args) => {
      return get(`api/getNumOfApplicationStatus/${selectedTerm.value}/${tutorOrMarker.value}`)
    },
    [],
    {
      resetOnExecute: false,
      immediate: false
    },
)


const getApplicationApprovalList = () => {
  if (selectedTerm.value && tutorOrMarker.value) {
    executeNum()
    if (selectedTab.value === '0') {
      executePendingApplication().then((res) => {
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
    } else if (selectedTab.value === '1') {
      executeAcceptedApplication()
    } else if (selectedTab.value === '2') {
      executeRejectedApplication()
    } else if (selectedTab.value === '3') {
      executePublishedApplication()
    }
  }
}

watch(tutorOrMarker, (newVal, oldVal) => {
  getApplicationApprovalList()
})

watch(selectedTab, (newVal, oldVal) => {
  getApplicationApprovalList()
})

watch(selectedTerm, (newVal, oldVal) => {
  getCourseByTermFromServer(selectedTerm.value)
  if (selectedTerm.value) {
    getApplicationApprovalList()
    localStorage.setItem('selectedTerm', selectedTerm.value)
  }
})


const course = ref([] as Course[])
const isCourseLoading = ref(false)

const getCourseByTermFromServer = (termID: number) => {
  isCourseLoading.value = true;
  get('api/getCourseByTerm/' + termID).then((res) => {
    course.value = []
    res.forEach((item: any) => {
      course.value.push({
        courseID: item.courseID,
        courseNum: item.courseNum,
        courseName: item.courseName,
        estimatedNumOfStudents: item.estimatedNumOfStudents,
        currentlyNumOfStudents: item.currentlyNumOfStudents,
        numOfAssignments: item.numOfAssignments,
        numOfLabsPerWeek: item.numOfLabsPerWeek,
        numOfTutorialsPerWeek: item.numOfTutorialsPerWeek,
        tutorResponsibility: item.tutorResponsibility,
        markerResponsibility: item.markerResponsibility,
        prerequisite: item.prerequisite,
        termID: item.termID,
        termName: item.termName,
        totalAvailableHours: item.totalAvailableHours,
        currentAvailableHours: item.currentAvailableHours,
        needTutors: item.needTutors,
        needMarkers: item.needMarkers,
        canPreAssign: item.canPreAssign,
        tutorDeadLine: item.tutorDeadLine,
        markerDeadLine: item.markerDeadLine
      })
    })
    isCourseLoading.value = false;
  })
}


onBeforeMount(() => {
  const permission = usePermissionStore()
  if (Array.from(permission.key).includes("7")) {
    tutorOrMarker.value = "marker"
  } else if (Array.from(permission.key).includes("6")) {
    tutorOrMarker.value = "tutor"
  }
  executeTerm().then(
      () => {
        if (stateTerm.value === null || stateTerm.value === undefined || stateTerm.value.length === 0) {
          return
        }
        stateTerm.value.sort((a: Term, b: Term) => {
          return b.termID! - a.termID!
        })
        const localTerm = localStorage.getItem('selectedTerm')
        if (localTerm && stateTerm.value.filter((t: { termID: number; }) => t.termID === parseInt(localTerm!)).length > 0) {
          selectedTerm.value = stateTerm.value.filter((t: { termID: number; }) => t.termID === parseInt(localTerm!))[0].termID
        } else {
          selectedTerm.value = stateTerm.value[0].termID
        }
        getApplicationApprovalList()
      }
  )
})


type PublishApplication = {
  applicationID: number,
  userID: string,
  name: string,
  email: string,
  upi: string,
  status: string
}

const publishTableData = ref([] as PublishApplication[])
const publishTableLoading = ref(false)
const publishDialogVisible = ref(false)
const publishTableRef = ref<InstanceType<typeof ElTable>>()
const submitPublishData = ref([] as number[])

const handlePublishSelectionChange = (val: PublishApplication[]) => {
  submitPublishData.value = val.map(item => item.applicationID)
}

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const publishEvent = async () => {
  publishTableLoading.value = true
  publishDialogVisible.value = true
  publishTableData.value = []
  await executeAcceptedApplication()
  await executeRejectedApplication()
  stateAcceptedApplication.value.forEach((item: any) => {
    publishTableData.value.push({
      applicationID: item.applicationID,
      userID: item.userID,
      name: item.name,
      email: item.email,
      upi: item.upi,
      status: "Accepted"
    })
  })
  stateRejectedApplication.value.forEach((item: any) => {
    publishTableData.value.push({
      applicationID: item.applicationID,
      userID: item.userID,
      name: item.name,
      email: item.email,
      upi: item.upi,
      status: "Rejected"
    })
  })
  publishTableRef.value?.toggleAllSelection()
  submitPublishData.value = publishTableData.value.map(item => item.applicationID)
  publishTableLoading.value = false
}


const submitPublishEvent = () => {
  publishTableLoading.value = true
  post('api/publishApplication', submitPublishData.value).then((res) => {
    getApplicationApprovalList()
    ElMessage({
      message: 'Publish Application Result Successfully!',
      type: 'success'
    })
    publishTableLoading.value = false
    publishDialogVisible.value = false
  }).catch((err) => {
    ElMessage({
      message: err.response.data.message,
      type: 'error'
    })
    publishTableLoading.value = false
    publishDialogVisible.value = false
  })
}


</script>


<style scoped>
.page-container {
  margin: 30px 30px 0;
}


.selected_item {
  font-size: 19px
}

.tabs-label {
  display: flex;
  align-items: center;
}


</style>