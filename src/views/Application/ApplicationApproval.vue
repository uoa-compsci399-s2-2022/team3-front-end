<template>
  <div class="page-container">
    <el-row>
    <el-select v-model="selectedTerm" class="m-2" placeholder="Term">
      <el-option
          v-for="item in stateTerm"
          :key="item.termName"
          :label="item.termName"
          :value="item"
      />
    </el-select>
    <el-select v-model="tutorOrMarker" class="m-2" placeholder="Marker or Tutor">
      <el-option key="Marker" label="Marker" value="Marker" />
      <el-option key="Tutor" label="Tutor" value="Tutor" />
    </el-select>
    </el-row>

    <br/>

  <el-button @click="resetDateFilter">reset date filter</el-button>
  <el-button @click="clearFilter">reset all filters</el-button>
  <el-table ref="tableRef" row-key="date" :data="tableData" style="width: 100%">
    <el-table-column
        prop="date"
        label="Date"
        sortable
        width="180"
        column-key="date"
        :filters="[
        { text: '2016-05-01', value: '2016-05-01' },
        { text: '2016-05-02', value: '2016-05-02' },
        { text: '2016-05-03', value: '2016-05-03' },
        { text: '2016-05-04', value: '2016-05-04' },
      ]"
        :filter-method="filterHandler"
    />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" :formatter="formatter" />

    <el-table-column
        prop="tag"
        label="Tag"
        width="100"
        :filters="[
        { text: 'Home', value: 'Home' },
        { text: 'Office', value: 'Office' },
      ]"
        :filter-method="filterTag"
        filter-placement="bottom-end"
    >
      <template #default="scope">
        <el-tag
            :type="scope.row.tag === 'Home' ? '' : 'success'"
            disable-transitions
        >{{ scope.row.tag }}</el-tag
        >
      </template>
    </el-table-column>
  </el-table>

  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElTable } from 'element-plus'
import type { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults'
import {useAsyncState} from "@vueuse/core";
import {get} from "@/utils/request";

const selectedTerm = ref({} as Term)
const tutorOrMarker = ref("")



const { isLoading:isLoadingTerm, state:stateTerm, isReady:isReadyTerm, execute:executeTerm } = useAsyncState(
    (args) => {
      return get('api/term')
    },
    {},
    {
      resetOnExecute: false,
    },
)


const tableRef = ref<InstanceType<typeof ElTable>>()

const resetDateFilter = () => {
  tableRef.value!.clearFilter(['date'])
}
// TODO: improvement typing when refactor table
const clearFilter = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  tableRef.value!.clearFilter()
}
const formatter = (row: User, column: TableColumnCtx<User>) => {
  return row.address
}
const filterTag = (value: string, row: User) => {
  return row.tag === value
}
const filterHandler = (
    value: string,
    row: User,
    column: TableColumnCtx<User>
) => {
  const property = column['property']
  return row[property] === value
}

const tableData: User[] = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    tag: 'Home',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    tag: 'Office',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    tag: 'Home',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    tag: 'Office',
  },
]
</script>


<style scoped>
.page-container {
  margin: 30px 30px;
}




</style>