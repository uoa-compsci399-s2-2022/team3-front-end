<template>
  <div class="list-container">
    <el-row justify="end">
      <el-col :span="8" :md="4" :lg="3">
        <el-button @click="showApplication" type="primary" size="large">+ Application</el-button>
      </el-col>
    </el-row>
    <el-button @click="clearFilter">Reset all filters</el-button>
    <el-table ref="tableRef" row-key="date" :data="tableData" style="width: 99%">
      <el-table-column
          prop="applicationID"
          label="ApplicationID"
          sortable
          column-key="date"

      />
      <el-table-column prop="term" label="Term"
                       :filters="termList"
                       :filter-method="filterHandler"/>
      <el-table-column prop="createdDateTime" label="Created DateTime"/>
      <el-table-column prop="submittedDateTime" label="Submitted DateTime"/>
      <el-table-column
          prop="status"
          label="Status"
          :filters="[
        { text: 'Success', value: 'Success' },
        { text: 'Pending', value: 'Pending' },
        { text: 'Failed', value: 'Failed' },
        { text: 'Unsubmit', value: 'Unsubmit' },
      ]"
          :filter-method="filterHandler"
          filter-placement="bottom-end"
      >
        <template #default="scope">
          <el-tag
              :type="statusType[scope.row.status]"
              disable-transitions
          >{{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <StartApplicationDrawer :visible="applicationVisible"/>
</template>

<script setup lang="ts">
import {onBeforeMount, reactive, ref} from 'vue'
import {ElTable} from 'element-plus'
import type {TableColumnCtx} from 'element-plus/es/components/table/src/table-column/defaults'
import {get, post} from '@/utils/request'
import StartApplicationDrawer from '@/components/StartApplicationDrawer.vue'


const applicationVisible = reactive({
  visible: false
})
const showApplication = () => {
  applicationVisible.visible = true
}

const statusType = {
  'Success': 'success',
  'Pending': 'info',
  'Failed': 'danger',
  'Unsubmit': 'warning'
}
const tableData: ApplicationList[] = reactive([] as ApplicationList[])
const termList = reactive([] as object[])
interface ApplicationList {
  [key: string]: any;
  applicationID: number
  term: string
  createdDateTime: string
  submittedDateTime: string
  status: string
}
const tableRef = ref<InstanceType<typeof ElTable>>()


const clearFilter = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  tableRef.value!.clearFilter()
}

const filterHandler = (
    value: string,
    row: ApplicationList,
    column: TableColumnCtx<ApplicationList>
) => {
  const property = column['property']
  return row[property] === value
}


onBeforeMount(() => {
  get('api/currentStudentApplicationList').then((res) => {
    console.log(res)
    tableData.push(...res)
  })

  get('api/term').then((res) => {
    console.log(res)
    res.forEach((e: { termName: string; }) => {
      termList.push({text: e.termName, value: e.termName})
    })
  })

})

</script>

<style scoped lang="scss">

.list-container {
  margin: 30px 30px;
}

</style>