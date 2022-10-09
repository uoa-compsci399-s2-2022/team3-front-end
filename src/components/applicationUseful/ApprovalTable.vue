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
      :edit-config="{trigger: 'manual', mode: 'row', showIcon:false}">
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
              {{row.auid}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  Submitted DateTime
                </div>
              </template>
              {{row.submittedDateTime}}
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>
                <div class="cell-item">
                  Other contracts
                </div>
              </template>
              {{row.otherContracts}}
            </el-descriptions-item>
          </el-descriptions>
          <br />
          <p class="emphasis">Preference Course</p>
          <vxe-table
              border
              show-overflow
              :row-config="{isHover: true}"
              :data="row.PreferCourse"
              @cell-click="showCourseDrawer">
            <vxe-column field="preference" title="#" width="30"></vxe-column>
            <vxe-column field="courseNum" title="Course Num" width="110"></vxe-column>
            <vxe-column field="courseName" title="Course Name"></vxe-column>
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
    <vxe-column field="applicationID" title="AppID" :edit-render="{}" width="65">
      <template #edit="{ row }">
        <vxe-input v-model="row.name" type="text"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="upi" title="UPI" :edit-render="{}" width="75">
      <template #edit="{ row }">
        <vxe-input v-model="row.upi" type="text"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="name" title="Name" :edit-render="{}" min-width="75">
      <template #edit="{ row }">
        <vxe-input v-model="row.name" type="text"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="gpa" title="GPA" :edit-render="{}" width="70">
      <template #edit="{ row }">
        <vxe-input v-model="row.gpa" type="number"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="PreferCourseGPA" title="PreferCourse GPA" width="110" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-input v-model="row.PreferCourseGPA" type="number"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="currentlyOverseas" title="Currently Overseas" width="95" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-select v-model="row.currentlyOverseas" clearable transfer>
          <vxe-option v-for="item in boolean" :key="item" :value="item" :label="item"></vxe-option>
        </vxe-select>
      </template>
    </vxe-column>
    <vxe-column field="willBackToNZ" title="Will back to NZ" width="88" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-select v-model="row.willBackToNZ" clearable transfer>
          <vxe-option v-for="item in boolean" :key="item" :value="item" :label="item"></vxe-option>
        </vxe-select>
      </template>
    </vxe-column>
    <vxe-column field="isCitizenOrPR" title="is Citizen or PR" width="79" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-select v-model="row.isCitizenOrPR" clearable transfer>
          <vxe-option v-for="item in boolean" :key="item" :value="item" :label="item"></vxe-option>
        </vxe-select>
      </template>
    </vxe-column>
    <vxe-column field="haveValidVisa" title="have Valid Visa" width="100" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-select v-model="row.haveValidVisa" clearable transfer>
          <vxe-option v-for="item in boolean" :key="item" :value="item" :label="item"></vxe-option>
        </vxe-select>
      </template>
    </vxe-column>
    <vxe-column field="enrolDetails" title="Enrol Details" width="110" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-input v-model="row.enrolDetails" type="text"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="studentDegree" title="Student Degree" :edit-render="{}" width="123">
      <template #edit="{ row }">
        <vxe-select v-model="row.studentDegree" clearable transfer>
          <vxe-option v-for="item in studentDegree" :key="item" :value="item" :label="item"></vxe-option>
        </vxe-select>
      </template>
    </vxe-column>
    <vxe-column field="haveOtherContracts" width="100" title="Have other contracts" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-select v-model="row.haveOtherContracts" clearable transfer>
          <vxe-option v-for="item in boolean" :key="item" :value="item" :label="item"></vxe-option>
        </vxe-select>
      </template>
    </vxe-column>
    <vxe-column field="maximumWorkingHours" title="Max working hours" width="108" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-input v-model="row.maximumWorkingHours" type="number"></vxe-input>
      </template>
    </vxe-column>

    <vxe-column title="Operation" width="150" :fixed="operationFixed">
      <template #default="{ row }">
        <div style="text-align: center">
          <template v-if="$refs.xTable.isEditByRow(row)">
            <el-button @click="saveRowEvent(row)" type="success" :icon="Select" circle plain/>
            <el-button @click="cancelRowEvent(row)" type="primary" :icon="SemiSelect" circle plain/>
          </template>
          <template v-else>
            <el-button @click="editRowEvent(row)" type="primary" :icon="Edit" circle plain/>
            <el-button type="success" :icon="Check" circle/>
            <el-button type="danger" :icon="Close" circle/>
          </template>
        </div>
      </template>
    </vxe-column>
    <template #empty>
      <el-empty description="No data. Please select Terms and Approval Type (Marker or Tutor)."/>
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


</template>

<script setup lang="ts">
import {VXETable, VxeTableInstance} from 'vxe-table'
import {ref, reactive, computed, watch, toRef, onBeforeMount} from 'vue'
import {Edit, Check, Close, Select, SemiSelect} from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/display.css';

const xTable = ref<VxeTableInstance>({} as VxeTableInstance)

const coursedrawer = ref(false)
const coursedrawerData = ref({})
const coursedrawerSize = ref()
const operationFixed = ref('right')

interface eventProps {
  row: any
}


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


onBeforeMount(() => {
  responsiveLayout()
})


const showCourseDrawer = ({row}: eventProps) => {
  coursedrawerData.value = row
  console.log(coursedrawerData.value)
  coursedrawer.value = true
}


const boolean = ref(['true', 'false'])
const studentDegree = ref(['Undergraduate', "Postgraduate"])


const props = defineProps(['applicationApprovalList', 'isLoading'])
const emit = defineEmits(['update:applicationApprovalList', 'update:isLoading'])
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

watch(props.applicationApprovalList, (val) => {
  console.log(val)
})


const isActiveStatus = (row: ItemVO) => {
  const $table = xTable.value
  return $table.isEditByRow(row)
}

const editRowEvent = (row: ItemVO) => {
  const $table = xTable.value
  $table.setEditRow(row)
}

const saveRowEvent = () => {
  const $table = xTable.value
  $table.clearEdit().then(() => {
    demo1.loading = true
    setTimeout(() => {
      demo1.loading = false
      VXETable.modal.message({content: '保存成功！', status: 'success'})
    }, 300)
  })
}

const cancelRowEvent = (row: ItemVO) => {
  const $table = xTable.value
  $table.clearEdit().then(() => {
    $table.revertData(row)
  })
}

</script>

<style scoped>

.expand-wrapper {
  padding: 20px;
  width: 70%;
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

</style>