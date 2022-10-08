<template>

  <vxe-table
      border
      show-overflow
      ref="xTable"
      :column-config="{resizable: true}"
      :row-config="{isHover: true}"
      :loading="isLoadingSync"
      :data="applicationApprovalListSync"
      :edit-config="{trigger: 'manual', mode: 'row', showIcon:false}">
    <vxe-column field="applicationID" title="Application ID" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-input v-model="row.name" type="text"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="upi" title="UPI" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-input v-model="row.upi" type="text"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="name" title="Name" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-input v-model="row.name" type="text"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="gpa" title="GPA" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-input v-model="row.gpa" type="number"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="PreferCourseGPA" title="Prefer Course GPA" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-input v-model="row.PreferCourseGPA" type="number"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="currentlyOverseas" title="Currently Overseas" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-select v-model="row.currentlyOverseas" clearable transfer>
          <vxe-option v-for="item in boolean" :key="item" :value="item" :label="item"></vxe-option>
        </vxe-select>
      </template>
    </vxe-column>
    <vxe-column field="willBackToNZ" title="Will Back To NZ" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-select v-model="row.willBackToNZ" clearable transfer>
          <vxe-option v-for="item in boolean" :key="item" :value="item" :label="item"></vxe-option>
        </vxe-select>
      </template>
    </vxe-column>
    <vxe-column field="isCitizenOrPR" title="is Citizen or PR" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-select v-model="row.isCitizenOrPR" clearable transfer>
          <vxe-option v-for="item in boolean" :key="item" :value="item" :label="item"></vxe-option>
        </vxe-select>
      </template>
    </vxe-column>
    <vxe-column field="haveValidVisa" title="have Valid Visa" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-select v-model="row.haveValidVisa" clearable transfer>
          <vxe-option v-for="item in boolean" :key="item" :value="item" :label="item"></vxe-option>
        </vxe-select>
      </template>
    </vxe-column>
    <vxe-column field="enrolDetails" title="Enrol Details" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-input v-model="row.enrolDetails" type="text"></vxe-input>
      </template>
    </vxe-column>
    <vxe-column field="studentDegree" title="Student Degree" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-select v-model="row.studentDegree" clearable transfer>
          <vxe-option v-for="item in studentDegree" :key="item" :value="item" :label="item"></vxe-option>
        </vxe-select>
      </template>
    </vxe-column>
    <vxe-column field="haveOtherContracts" title="have Other Contracts" :edit-render="{}">
      <template #edit="{ row }">
        <vxe-select v-model="row.haveOtherContracts" clearable transfer>
          <vxe-option v-for="item in boolean" :key="item" :value="item" :label="item"></vxe-option>
        </vxe-select>
      </template>
    </vxe-column>

    <vxe-column title="Operation" width="150">
      <template #default="{ row }">
        <div style="text-align: center">
        <template v-if="$refs.xTable.isEditByRow(row)">
          <el-button @click="saveRowEvent(row)" type="success" :icon="Select" circle plain />
          <el-button @click="cancelRowEvent(row)" type="primary" :icon="SemiSelect" circle plain />
        </template>
        <template v-else>
          <el-button @click="editRowEvent(row)" type="primary" :icon="Edit" circle plain />
          <el-button type="success" :icon="Check" circle />
          <el-button type="danger" :icon="Close" circle />
        </template>
        </div>
      </template>
    </vxe-column>
    <template #empty>
      <el-empty description="No data. Please select Terms and Approval Type (Marker or Tutor)."/>
    </template>
  </vxe-table>

</template>

<script setup lang="ts">
import { VXETable, VxeTableInstance } from 'vxe-table'
import {ref, reactive, computed, watch} from 'vue'
import {Edit, Check, Close, Select, SemiSelect} from '@element-plus/icons-vue'

const xTable = ref<VxeTableInstance>({} as VxeTableInstance)


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

</style>