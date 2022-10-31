<template>
  <vxe-table
      border
      class="fixed-table"
      height="100%"
      ref="xTable"
      :column-config="{resizable: true}"
      :row-config="{isHover: true}"
      :scroll-y="{mode: 'wheel'}"
      :loading="isLoadingSync"
      :loading-config="{icon: 'vxe-icon-indicator roll', text: 'Loading...'}"
      :data="applicationApprovalListSync"
      :edit-config="{trigger: 'manual', mode: 'row', showIcon:false}"
      :checkbox-config="{highlight: true}"
      @toggle-row-expand="toggleExpandChangeEvent">
    <vxe-column type="checkbox" width="40"></vxe-column>
    <vxe-column type="expand" width="40">
      <template #content="{ row, rowIndex }">
        <div class="expand-wrapper">
          <p class="emphasis">Other Personal Details</p>
          <el-descriptions
              class="margin-top"
              :column="3"
              border
          >
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  userID
                </div>
              </template>
              {{ row.userID }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  email
                </div>
              </template>
              {{ row.email }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  AUID
                </div>
              </template>
              {{ row.auid }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  Submitted DateTime
                </div>
              </template>
              {{ datetimeFormat(row.submittedDateTime) }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  Other contracts
                </div>
              </template>
              {{ row.otherContracts }}
            </el-descriptions-item>
          </el-descriptions>
          <div style="margin-top: 10px">
            <el-button type="primary" :icon="Download" @click="getCV(row.applicationID)" :loading="loadingCV" plain>CV
            </el-button>
            <el-button type="primary" :icon="Download" @click="getTranscript(row.applicationID)"
                       :loading="loadingTranscript" plain>Transcript
            </el-button>
          </div>
          <div v-if="['1', '3'].includes(tagIndexSync)">
            <p class="emphasis" v-if="tagIndexSync === '1'">Enrolled Courses (Not Published)</p>
            <p class="emphasis" v-if="tagIndexSync === '3'">Enrolled Courses (Published)</p>
            <vxe-table
                border
                :row-config="{isHover: true}"
                :data="row.EnrolledCourse">
              <vxe-column field="courseNum" title="Course Num" width="110"></vxe-column>
              <vxe-column field="courseName" title="Course Name" width="300"></vxe-column>
              <vxe-column field="estimatedHours" title="The estimated work hours assigned to the student"></vxe-column>
              <vxe-column field="totalAvailableHours" title="Total Available Hours" width="110"></vxe-column>
              <vxe-column field="currentAvailableHours" title="Available Hours (include no published)"
                          width="110"></vxe-column>
              <vxe-column field="currentPublishedAvailableHours" title="Published Available Hours"
                          width="110"></vxe-column>
              <template #empty>
                No Enroll's course
              </template>
            </vxe-table>
          </div>
          <br/>
          <p class="emphasis">Preference Course</p>
          <vxe-table
              border
              show-overflow
              :row-config="{isHover: true}"
              :data="row.PreferCourse"
              @cell-click="showCourseDrawer">
            <vxe-column field="preference" title="#" width="40"></vxe-column>
            <vxe-column field="courseNum" title="Course Num" width="110"></vxe-column>
            <vxe-column field="courseName" title="Course Name"></vxe-column>
            <vxe-column field="courseCoordinatorEndorsed" title="CC Endorsed" :edit-render="{}" width="70"
                        align="center">
              <template #default="{ row }">
                <el-icon class="star" v-show="row.courseCoordinatorEndorsed">
                  <StarFilled/>
                </el-icon>
              </template>
            </vxe-column>
            <vxe-column field="hasLearned" title="has Learned" width="100"></vxe-column>
            <vxe-column field="grade" title="Grade" width="60"></vxe-column>
            <vxe-column field="explanation" title="Explanation(No Learned)"></vxe-column>
            <vxe-column field="preExperience" title="Pre Experience"></vxe-column>
            <template #empty>
              No Preference Course
            </template>
          </vxe-table>
        </div>
      </template>
    </vxe-column>
    <vxe-column field="applicationID" title="AppID" width="65">
    </vxe-column>
    <vxe-column field="status" title="Result" width="85"
                :filters="[{label: 'Accepted', value: 'Accepted'}, {label: 'Rejected', value: 'Rejected'}]"
                :filter-multiple=false v-if="tagIndexSync==='3'">
      <template #default="{ row, rowIndex }">
        <el-tag
            :type="row.status === 'Accepted' ? 'success' : 'danger'"
        >
          {{ row.status }}
        </el-tag>
      </template>
    </vxe-column>
    <vxe-column field="upi" title="UPI" :edit-render="{}" width="75">
      <template #edit="{ row }">
        <vxe-input v-model="row.upi" type="text"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="name" title="Name" :edit-render="{}" min-width="100">
      <template #edit="{ row }">
        <vxe-input v-model="row.name" type="text"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="gpa" title="GPA" :edit-render="{}" width="85" sortable>
      <template #edit="{ row }">
        <vxe-input v-model="row.gpa" type="float" digits="3"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="haveCourseCoordinatorEndorsed" title="Have CC Endorsed" :edit-render="{}" width="85"
                align="center" :filters="[{label: 'Yes', value: true}, {label: 'No', value: false}]"
                :filter-multiple=false>
      <template #default="{ row }">
        <el-icon class="star" v-show="row.haveCourseCoordinatorEndorsed">
          <StarFilled/>
        </el-icon>
      </template>
    </vxe-column>
    <vxe-column field="PreferCourseGPA" title="PreferCourse GPA" width="110" sortable>
    </vxe-column>
    <vxe-column field="currentlyOverseas" title="Currently Overseas" width="95" :edit-render="{}"
                :filters="[{label: 'Yes', value: true}, {label: 'No', value: false}]" :filter-multiple=false>
      <template #edit="{ row }">
        <vxe-select v-model="row.currentlyOverseas" clearable transfer>
          <vxe-option v-for="item in boolean" :key="item.value" :value="item.value" :label="item.label"></vxe-option>
        </vxe-select>
      </template>
      <template #default="{ row }">
        <span>{{ formatBool(row.currentlyOverseas) }}</span>
      </template>
    </vxe-column>
    <vxe-column field="willBackToNZ" title="Will back to NZ" width="88" :edit-render="{}"
                :filters="[{label: 'Yes', value: true}, {label: 'No', value: false}]" :filter-multiple=false>
      <template #edit="{ row }">
        <vxe-select v-model="row.willBackToNZ" clearable transfer>
          <vxe-option v-for="item in boolean" :key="item.value" :value="item.value" :label="item.label"></vxe-option>
        </vxe-select>
      </template>
      <template #default="{ row }">
        <span>{{ formatBool(row.willBackToNZ) }}</span>
      </template>
    </vxe-column>
    <vxe-column field="isCitizenOrPR" title="is Citizen or PR" width="79" :edit-render="{}"
                :filters="[{label: 'Yes', value: true}, {label: 'No', value: false}]" :filter-multiple=false>
      <template #edit="{ row }">
        <vxe-select v-model="row.isCitizenOrPR" clearable transfer>
          <vxe-option v-for="item in boolean" :key="item.value" :value="item.value" :label="item.label"></vxe-option>
        </vxe-select>
      </template>
      <template #default="{ row }">
        <span>{{ formatBool(row.isCitizenOrPR) }}</span>
      </template>
    </vxe-column>
    <vxe-column field="haveValidVisa" title="have Valid Visa" width="100" :edit-render="{}"
                :filters="[{label: 'Yes', value: true}, {label: 'No', value: false}]" :filter-multiple=false>
      <template #edit="{ row }">
        <vxe-select v-model="row.haveValidVisa" clearable transfer>
          <vxe-option v-for="item in boolean" :key="item.value" :value="item.value" :label="item.label"></vxe-option>
        </vxe-select>
      </template>
      <template #default="{ row }">
        <span>{{ formatBool(row.haveValidVisa) }}</span>
      </template>
    </vxe-column>
    <vxe-column field="enrolDetails" title="Enrol Details" width="110" :edit-render="{}" show-overflow>
      <template #edit="{ row }">
        <vxe-input v-model="row.enrolDetails" type="text"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="studentDegree" title="Student Degree" :edit-render="{}" width="123"
                :filters="[{label: 'Undergraduate', value: 'Undergraduate'}, {label: 'Postgraduate', value: 'Postgraduate'}]"
                :filter-multiple=false>
      <template #edit="{ row }">
        <vxe-select v-model="row.studentDegree" clearable transfer>
          <vxe-option v-for="item in studentDegree" :key="item" :value="item" :label="item"></vxe-option>
        </vxe-select>
      </template>
    </vxe-column>
    <vxe-column field="haveOtherContracts" width="100" title="Have other contracts" :edit-render="{}"
                :filters="[{label: 'Yes', value: true}, {label: 'No', value: false}]" :filter-multiple=false>
      <template #edit="{ row }">
        <vxe-select v-model="row.haveOtherContracts" clearable transfer>
          <vxe-option v-for="item in boolean" :key="item.value" :value="item.value" :label="item.label"></vxe-option>
        </vxe-select>
      </template>
      <template #default="{ row }">
        <span>{{ formatBool(row.haveOtherContracts) }}</span>
      </template>
    </vxe-column>
    <vxe-column field="maximumWorkingHours" title="Max working hours" width="108" :edit-render="{}" sortable>
      <template #edit="{ row }">
        <vxe-input v-model="row.maximumWorkingHours" type="number"></vxe-input>
      </template>
    </vxe-column>

    <vxe-column title="Operation" width="160" :fixed="operationFixed" v-if="tagIndexSync!=='3'">
      <template #default="{ row }">
        <div style="text-align: center">
          <template v-if="xTable.isEditByRow(row)">
            <el-button @click="saveRowEvent(row)" type="success" :icon="Select" circle plain/>
            <el-button @click="cancelRowEvent(row)" type="primary" :icon="SemiSelect" circle plain/>
          </template>
          <template v-else>
            <el-tooltip content="Edit" placement="bottom" :show-after="400">
              <el-button @click="editRowEvent(row)" type="primary" :icon="Edit" circle plain/>
            </el-tooltip>
            <el-tooltip content="Accept" placement="bottom" :show-after="400" v-if="tagIndexSync!=='1'">
              <el-button type="success" :icon="Check" @click="acceptEvent(row)" circle/>
            </el-tooltip>
            <el-popconfirm title="Are you sure to reject the application?" @confirm="rejectToServer(row)" width="50"
                           v-if="tagIndexSync!=='2'">
              <template #reference>
                <!--                <el-tooltip content="Reject" placement="bottom" :show-after="400" v-if="tagIndexSync!=='2'">-->
                <el-button type="danger" :icon="Close" circle/>
                <!--                </el-tooltip>-->
              </template>
            </el-popconfirm>

          </template>
        </div>
      </template>
    </vxe-column>
    <template #empty>
      <el-empty description="No data. Please select other Terms and Approval Type (Marker or Tutor)."/>
    </template>
  </vxe-table>


  <el-drawer
      v-model="coursedrawer"
      title="Preference Course Viewer"
      :size="coursedrawerSize"
  >
    <el-descriptions :column="4" direction="vertical" border>
      <el-descriptions-item
          label="Preference"
      >{{ coursedrawerData.preference }}
      </el-descriptions-item
      >
      <el-descriptions-item
          label="Course Number"
      >{{ coursedrawerData.courseNum }}
      </el-descriptions-item
      >
      <el-descriptions-item label="Course Name"
      >{{ coursedrawerData.courseName }}
      </el-descriptions-item
      >
      <el-descriptions-item label="grade">
        <el-tag size="small">{{ coursedrawerData.grade }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="Has Learned"
      >{{ coursedrawerData.hasLearned }}
      </el-descriptions-item
      >
      <el-descriptions-item label="Explanation" :span="3"
      >{{ coursedrawerData.explanation }}
      </el-descriptions-item
      >
      <el-descriptions-item label="Pre Experience" :span="4"
      >{{ coursedrawerData.preExperience }}
      </el-descriptions-item
      >
    </el-descriptions>
  </el-drawer>


  <el-dialog v-model="enrollDialogVisible" title="Accept" v-loading="acceptToServerLoading" draggable>
    <el-alert
        type="info"
        effect="dark"
        title="Note: After Accept, there are not direct enrolled. It will be enrolled after clicking Publish."
        style="margin-bottom: 11px; margin-top: 0"
        show-icon
        center
        :closable="false"
    />
    <el-alert
        type="warning"
        title="Below is the preference course for this student, and you can modify them."
        style="margin-bottom: 9px; margin-top: 0"
        show-icon
    />
    <el-form :model="singleEnrollForm">
      <el-form-item
          v-for="(domain, index) in singleEnrollForm.domains"
          :key="index"
          :label="'Course' + (index+1)"
          :prop="'domains.'+index+'.courseID'"
          :rules="{
            required: true,
            message: 'You must choose a course',
            trigger: 'blur',
      }">
        <el-select v-model="domain.courseID" placeholder="Input Course Num" filterable>
          <div v-for="item in course">
            <el-popover
                placement="right"
                :title="item.courseNum + ' - ' + item.courseName"
                :width="600"
                trigger="hover"
                :hide-after="0"
            >
              <template #reference>
                <el-option
                    :key="item.courseID"
                    :label="item.courseNum"
                    :value="item.courseID"
                >
                  <span style="float: left">{{ item.courseNum }}</span>
                  <span class="course-select-option"
                        style="float: right">UAEH: {{item.currentAvailableHours}}</span>
                </el-option>
              </template>
              <el-alert
                  v-show="closedCourseAvailableHoursAlert"
                  title="UAEH"
                  type="info"
                  effect="dark"
                  style="margin-bottom: 7px"
                  description="This number of Unpublished Available Estimated Hours means(for this course): Total Available Hours - Pre assigned Tutor & Marker Hours - the total estimated hours that have been accepted and enrolled(include: No Published & Published)"
                  show-icon
                  @close="setClosedCourseAvailableHoursAlert"
              />
              <el-descriptions border :column="2" style="margin-bottom: 5px">
                <el-descriptions-item label="Published Available Estimated Hours" label-align="center"
                                      align="center">
                  <span style="color: #0b416d; font-weight: bold">{{ item.currentPublishedAvailableHours }}</span>
                </el-descriptions-item>
                <el-descriptions-item
                    label="Estimated Number of Students"
                    label-align="center"
                    align="center"
                >{{ item.estimatedNumOfStudents }}
                </el-descriptions-item>
                <el-descriptions-item label="Currently Number Of Students" label-align="center" align="center">
                  {{ item.currentlyNumOfStudents }}
                </el-descriptions-item>
                <el-descriptions-item label="Number of Assignments" label-align="center" align="center">
                  {{ item.numOfAssignments }}
                </el-descriptions-item>
                <el-descriptions-item label="Number of Labs per Week" label-align="center" align="center">
                  {{ item.numOfLabsPerWeek }}
                </el-descriptions-item>
                <el-descriptions-item label="Number of Tutorials per Week" label-align="center" align="center">
                  {{ item.numOfTutorialsPerWeek }}
                </el-descriptions-item>
                <el-descriptions-item label="Prerequisite" label-align="center" :span="2"
                                      align="center">{{ item.prerequisite }}
                </el-descriptions-item>
              </el-descriptions>
              <div v-if="tutorOrMarker === 'tutor'">
                <p class="emphasis">Tutor Responsibility</p>
                <p>{{ item.tutorResponsibility }}</p>
                <p v-if="!item.tutorResponsibility" style="text-align: center">No Information</p>
              </div>
              <div v-else-if="tutorOrMarker === 'marker'">
                <p class="emphasis">Marker Responsibility</p>
                <p>{{ item.markerResponsibility }}</p>
                <p v-if="!item.markerResponsibility" style="text-align: center">No Information</p>
              </div>
            </el-popover>
          </div>
        </el-select>
        <el-tooltip
            effect="dark"
            content="Estimated working hours for the course"
            placement="left"
        >
          <el-input-number v-model="domain.estimatedHours" :step="1" style="margin-left: 8px"
                           :min="0"/>
        </el-tooltip>
        <el-button style="margin-left: 8px" @click.prevent="removeDomain(domain)" icon="Delete" type="danger" circle
                   plain/>
      </el-form-item>
      <el-form-item>
        <el-button @click="addDomain" type="primary">Add a course</el-button>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="enrollDialogVisible = false">Cancel</el-button>
        <el-button type="success" @click="acceptToServer"
        >Accept</el-button
        >
      </span>
    </template>
  </el-dialog>


</template>

<script setup lang="ts">
import {VXETable, VxeTableEvents, VxeTableInstance} from 'vxe-table'
import {ref, reactive, computed, watch, toRef, onBeforeMount, onUpdated} from 'vue'
import {Edit, Check, Close, Select, SemiSelect, Delete, Download, StarFilled} from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/display.css';
import {get, post, put} from "@/utils/request";
import {ElMessage} from "element-plus";
import type {FormInstance} from 'element-plus'
import {datetimeFormat} from "@/utils/datetimeFormat";
import {base64ToBlob} from '@/utils/base64ToBlob';
// *********************
// * Sync Parameter
// *********************
const props = defineProps(['applicationApprovalList', 'isLoading', 'tagIndex', 'course', 'isCourseLoading', 'tutorOrMarker'])
const emit = defineEmits(['update:applicationApprovalList', 'update:isLoading', 'update:tagIndex', 'reloadApplicationApprovalList'])

const applicationApprovalListSync = computed({
  get() {
    return props.applicationApprovalList as applicationApprovalList[]
  },
  set(value) {
    emit('update:applicationApprovalList', value)
  }
})

const isLoadingSync = computed({
  get() {
    return props.isLoading as boolean
  },
  set(value) {
    emit('update:isLoading', value)
  }
})

const tagIndexSync = computed({
  get() {
    return props.tagIndex as string
  },
  set(value) {
    emit('update:tagIndex', value)
  }
})

const reloadApplicationApprovalList = () => {
  emit('reloadApplicationApprovalList')
}


// *********************
// * Layout
// *********************
const coursedrawerSize = ref()
const operationFixed = ref('right' as any)

setInterval(() => {
  coursedrawerSize.value = getWidth() > 768 ? '40%' : '100%'
}, 2000)


const getWidth = () => {
  return window.innerWidth
}

const responsiveLayout = () => {
  coursedrawerSize.value = getWidth() > 768 ? '40%' : '100%'
  operationFixed.value = getWidth() > 768 ? 'right' : ''
}


// *********************
// * Prefer Course Drawer
// *********************
type CourseDrawer = {
  preference: number;
  courseID: number;
  courseName: string;
  courseNum: string;
  grade: string;
  hasLearned: boolean;
  explanation: string;
  preExperience: string;
}


const coursedrawer = ref(false)
const coursedrawerData = ref({} as CourseDrawer)

const showCourseDrawer = ({row}: eventProps) => {
  coursedrawerData.value = row
  coursedrawer.value = true
}


interface eventProps {
  row: any
}

// *********************
// * Enroll Dialog
// *********************
const enrollDialogVisible = ref(false)
const closedCourseAvailableHoursAlert = ref()
const currentApplicationID = ref()
const acceptToServerLoading = ref(false)

const setClosedCourseAvailableHoursAlert = () => {
  localStorage.setItem('closedCourseAvailableHoursAlert', 'false')
  closedCourseAvailableHoursAlert.value = false
}

const acceptEvent = (row: any) => {
  singleEnrollForm.domains = []
  let warningMessage = []
  if (row.PreferCourse !== null && row.PreferCourse !== undefined) {
    row.PreferCourse.forEach((item: any) => {
      if (props.course.find((course: any) => course.courseID === item.courseID)) {
        singleEnrollForm.domains.push({
          courseID: item.courseID,
          estimatedHours: null
        })
      } else {
        warningMessage.push(`This user's preference course with courseID: ${item.courseID} has not been found in the term`)
      }
    })
  }
  currentApplicationID.value = row.applicationID
  enrollDialogVisible.value = true
  setTimeout(() => {
    warningMessage.forEach((item: any) => {
      ElMessage({
        message: item,
        type: 'warning'
      })
    })
  }, 100)
}

const formRef = ref<FormInstance>()
const singleEnrollForm = reactive<{
  domains: DomainItem[]
}>({
  domains: []
})

interface DomainItem {
  courseID: number | undefined
  estimatedHours: number
}

const removeDomain = (item: DomainItem) => {
  const index = singleEnrollForm.domains.indexOf(item)
  if (index !== -1) {
    singleEnrollForm.domains.splice(index, 1)
  }
}

const addDomain = () => {
  singleEnrollForm.domains.push({
    courseID: undefined,
    estimatedHours: 0
  })
}

const acceptToServer = () => {
  acceptToServerLoading.value = true
  put(`api/applicationApproval/${currentApplicationID.value}/Accepted`, {data: singleEnrollForm.domains})
      .then((res) => {
        reloadApplicationApprovalList()
        ElMessage.success('Accept successfully!')
        acceptToServerLoading.value = false
        enrollDialogVisible.value = false
      })
      .catch((err) => {
        console.log(err)
        ElMessage({
          message: err.response.data.message,
          type: 'error'
        })
        acceptToServerLoading.value = false
      })
}

// *********************
// * Reject
// *********************
const rejectToServerLoading = ref(false)
const rejectToServer = (row: any) => {
  rejectToServerLoading.value = true
  put(`api/applicationApproval/${row.applicationID}/Rejected`, {})
      .then((res) => {
        reloadApplicationApprovalList()
        ElMessage.success('Reject successfully!')
        rejectToServerLoading.value = false
      })
      .catch((err) => {
        console.log(err)
        ElMessage({
          message: err.response.data.message,
          type: 'error'
        })
        rejectToServerLoading.value = false
      })
}


// *********************
// * Table
// *********************
const xTable = ref<VxeTableInstance>({} as VxeTableInstance)
const boolean = ref([{label: 'Yes', value: 'true'}, {label: 'No', value: 'false'}])
const studentDegree = ref(['Undergraduate', "Postgraduate"])

onUpdated(() => {
  const $table = xTable.value
  $table.refreshColumn()
})

type saveApplicationApprovalList = {
  upi: string
  name: string
  studentDegree: string
  haveOtherContracts: boolean
  maximumWorkingHours: number
  gpa: number
  currentlyOverseas: boolean
  willBackToNZ: boolean
  isCitizenOrPR: boolean
  haveValidVisa: boolean
  enrolDetails: string

}


const autoSaveUpdateEvent = async (row: any, applicationID: number) => {
  const $table = xTable.value
  const {updateRecords} = $table.getRecordset()
  const errMap = await $table?.validate()
  if (errMap) {
    return
  }
  try {
    await post(`api/saveApplication/${applicationID}`, {"applicationPersonalDetail": row}).then(
        (res) => {
          ElMessage({
            message: 'Save success',
            type: 'success'
          })
          reloadApplicationApprovalList()
        }).catch((err) => {
      ElMessage({
        message: err.response.data['message'],
        type: 'error'
      })
      reloadApplicationApprovalList()
    })
  } catch (e: any) {
    if (e && e.message) {
      ElMessage({
        message: e.message,
        type: 'error'
      })
    }
    reloadApplicationApprovalList()
  }
}


const editRowEvent = (row: any) => {
  const $table = xTable.value
  $table.setEditRow(row)
}

const saveRowEvent = (row: any) => {
  const $table = xTable.value
  $table.clearEdit().then(() => {
    isLoadingSync.value = true
    const toServerRow: saveApplicationApprovalList = {
      upi: row.upi,
      name: row.name,
      studentDegree: row.studentDegree,
      haveOtherContracts: eval(row.haveOtherContracts),
      maximumWorkingHours: row.maximumWorkingHours,
      gpa: row.gpa,
      currentlyOverseas: eval(row.currentlyOverseas),
      willBackToNZ: eval(row.willBackToNZ),
      isCitizenOrPR: eval(row.isCitizenOrPR),
      haveValidVisa: eval(row.haveValidVisa),
      enrolDetails: row.enrolDetails
    }
    autoSaveUpdateEvent(toServerRow, row.applicationID)
  })
}

const cancelRowEvent = (row: any) => {
  const $table = xTable.value
  $table.clearEdit().then(() => {
    $table.revertData(row)
  })
}

const toggleExpandChangeEvent = ({row}: eventProps) => {
  const $table = xTable.value
  $table.refreshColumn()
}

const formatBool = (row) => {
  if (row === true) {
    return 'Yes'
  } else if (row === false) {
    return 'No'
  }
}

const loadingCV = ref(false)
const loadingTranscript = ref(false)


async function getCV(applicationID: any) {
  loadingCV.value = true
  let CVBase64 = await get('api/ApplicationCV/' + applicationID);
  // console.log(CVBase64)
  let blob = base64ToBlob(CVBase64.applicationCV);
  let bloburl = window.URL.createObjectURL(blob);
  window.open(bloburl);
  loadingCV.value = false
}


async function getTranscript(applicationID: any) {
  loadingTranscript.value = true
  let transcriptBase64 = await get('api/ApplicationTranscript/' + applicationID);
  // let blob = base64ToBlob(transcriptBase64.application)
  let blob = base64ToBlob(transcriptBase64.applicationTranscript);
  let bloburl = window.URL.createObjectURL(blob);
  window.open(bloburl);
  loadingTranscript.value = false
}

onBeforeMount(() => {
  responsiveLayout()
  closedCourseAvailableHoursAlert.value = localStorage.getItem('closedCourseAvailableHoursAlert') === null
})

</script>

<style scoped>

.expand-wrapper {
  padding: 20px;
  width: 60%;
}

.emphasis {
  color: #9d9ea1;
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 17px;
}

.fixed-table {
  height: calc(100vh - 222px);
  margin-bottom: 0;
}

.course-select-option {
  margin-left: 20px;
  color: var(--el-text-color-secondary);
  font-size: 13px;
}

.star {
  color: rgb(255, 221, 0);
  font-size: 25px;
}

</style>