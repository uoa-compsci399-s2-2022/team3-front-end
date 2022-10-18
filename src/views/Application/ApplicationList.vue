<template>
  <div class="list-container">
    <el-row justify="end">
      <el-col :span="8" :md="4" :lg="3">
        <el-button @click="showApplication" type="primary" size="large">+ Application</el-button>
      </el-col>
    </el-row>
    <el-button @click="clearFilter">Reset all filters</el-button>
    <el-table ref="tableRef" row-key="date" :data="tableData" style="width: 99%" @row-click="tableRowClick" v-loading="applicationListLoading">
      <el-table-column
          prop="applicationID"
          label="ApplicationID"
          sortable
          column-key="date"

      />
      <el-table-column prop="term" label="Term"
                       :filters="termList"
                       :filter-method="filterHandler"/>
      <el-table-column prop="createdDateTime" label="Created DateTime" sortable/>
      <el-table-column prop="submittedDateTime" label="Submitted DateTime" :min-width="90" sortable/>
      <el-table-column
          prop="type"
          label="Type"
          :filters="[
        { text: 'Marker', value: 'marker' },
        { text: 'Tutor', value: 'tutor' }
      ]"
          :filter-method="filterHandler"
          filter-placement="bottom-end"/>
      <el-table-column
          prop="status"
          label="Status"
          :filters="[
        { text: 'Accepted', value: 'Accepted' },
        { text: 'Pending', value: 'Pending' },
        { text: 'Rejected', value: 'Rejected' },
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

      <el-table-column align="right">
        <template #default="scope">
          <div v-show="scope.row.status === 'Unsubmit'">
            <el-popconfirm title="Are you sure to delete?" @confirm.stop="handleAppDelete(scope.$index, scope.row)"
                           width="30">
              <template #reference>
                <el-button
                    size="small"
                    type="danger"
                    @click.stop=""
                >Delete
                </el-button>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <StartApplicationDrawer :visible="applicationVisible"/>
</template>

<script setup lang="ts">
import {onBeforeMount, reactive, ref} from 'vue'
import {ElMessage, ElTable} from 'element-plus'
import type {TableColumnCtx} from 'element-plus/es/components/table/src/table-column/defaults'
import {get, post, Delete} from '@/utils/request'
import StartApplicationDrawer from '@/components/applicationUseful/StartApplicationDrawer.vue'
import {useRouter, useRoute} from 'vue-router';
import dayjs from "dayjs";
import {datetimeFormat} from "@/utils/datetimeFormat";

const router = useRouter();
const route = useRoute();


const applicationListLoading = ref(false)

const applicationVisible = reactive({
  visible: false
})
const showApplication = () => {
  applicationVisible.visible = true
}

const statusType = {
  'Accepted': 'success',
  'Pending': 'info',
  'Rejected': 'danger',
  'Unsubmit': 'warning'
}
const tableData: ApplicationList[] = reactive([] as ApplicationList[])
const termList = reactive([] as any[])

interface ApplicationList {
  [key: string]: any;

  applicationID: number
  term: string
  createdDateTime: string
  submittedDateTime: string
  status: string
  type: string

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


const tableRowClick = (row: ApplicationList) => {
  if (row.status === 'Unsubmit') {
    router.push('/application/' + row.applicationID)
  }
}

const handleAppDelete = (index: number, row: ApplicationList) => {
  Delete(`api/application/${row.applicationID}`).then(() => {
    tableData.splice(index, 1)
  }).catch((err) => {
    ElMessage({
      message: err.response.data.message,
      type: 'error'
    })
  })
}

onBeforeMount(() => {
  get('api/currentStudentApplicationList').then((res) => {
    applicationListLoading.value = true
    tableData.splice(0, tableData.length)
    res.forEach((item: ApplicationList) => {
      item.createdDateTime = datetimeFormat(item.createdDateTime)
      item.submittedDateTime = datetimeFormat(item.submittedDateTime)
    })
    tableData.push(...res)
    applicationListLoading.value = false
  })

  get('api/availableTerm').then((res) => {
    res.forEach((e: { termName: string; }) => {
      termList.push({text: e.termName, value: e.termName})
    })
  })

})

</script>

<style scoped>

.list-container {
  margin: 30px 30px;
}

</style>