<template>
  <div class="page-container">
    <el-row class="header-container">
        <el-select v-model="currentTerm" @change="handleTermChange" class="m-2" placeholder="Select Term" size="large" v-loading="isLoadingTerm">
          <el-option
              v-for="item in stateTerm"
              :key="item.termName"
              :label="item.termName"
              :value="item.termID"
          />
        </el-select>
        <el-alert class="alert" title="Tips: Please Select Term First" type="warning"  show-icon />
    </el-row>

    <el-row :gutter="22" class="table-wrapper">
      <el-col :span="12" class="leftBox">
        <el-row justify="center">
          <span class="tableTitle">Course List</span>
        </el-row>

        <el-table
            v-loading="isLoadingCourse"
            ref="singleTableRef"
            :data="stateCourse"
            highlight-current-row
            style="width: 100%"
            @current-change="handleCurrentChange"
        >
          <el-table-column property="courseNum" label="Course Num" width="120" />
          <el-table-column property="courseName" label="Course Name" width="250" />
          <el-table-column property="canPreAssign" label="Can Pre Assign" />
          <template #empty>
            <el-empty description="No Data" />
          </template>
        </el-table>

      </el-col>

      <el-col :span="12">
        <el-row justify="center">
          <span class="tableTitle">Student List</span>
        </el-row>

        <el-table
            v-loading="isLoadingUser"
            ref="singleTableRef"
            :data="stateUser"
            highlight-current-row
            style="width: 100%"
        >
          <el-table-column property="id" label="ID" width="120" />
          <el-table-column property="email" label="Email" width="200" />
          <el-table-column property="name" label="Name"  />
          <el-table-column label="Position"  width="150">
            <template #default="scope">
              <el-tag>
                {{scope.row.roleInCourse}}
              </el-tag>
            </template>
            
          </el-table-column>
          <template #empty>
            <el-empty description="No Data" />
          </template>
        </el-table>

        <el-row justify="center" v-if="isReadyUser" style="margin-top: 10px">
          <el-button @click="showUser" type="primary" :icon="Plus" style="margin-left: 16px ;">Appoint position</el-button>
        </el-row>
      </el-col>
    </el-row>
  </div>

  <AddUserDrawer :visible="UserVisible" direction="ltr" :currentCourse="currentCourse!"/>

</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import { useAsyncState } from '@vueuse/core'
import {get, post,Delete} from "@/utils/request";
import {ElMessage, ElTable} from 'element-plus'
import {Plus} from '@element-plus/icons-vue'
import AddUserDrawer from '@/components/ManageUseful/AddUserDrawer.vue'

const currentTerm = ref<Term>();
const currentCourse = ref<Course>();



const { isLoading:isLoadingTerm, state:stateTerm, isReady:isReadyTerm, execute:executeTerm } = useAsyncState(
    (args) => {
      return get('api/term')
    },
    {},
    {
      resetOnExecute: false,
    },
)

const { isLoading:isLoadingCourse, state:stateCourse, isReady:isReadyCourse, execute:executeCourse } = useAsyncState(
    (args) => {
        const termID = args.termID
        return get('api/getCourseByTerm/'+termID);
    },
    [],
    {
      resetOnExecute: false,
      immediate: false
    },
)

const { isLoading:isLoadingUser, state:stateUser, isReady:isReadyUser, execute:executeUser } = useAsyncState(
    (args) => {
      const courseID = args.courseID
      return get('api/getCourseUser/'+courseID);
    },
    [],
    {
      resetOnExecute: false,
      immediate: false
    },
)

const handleTermChange = () => {
  if (currentTerm.value){
    executeCourse(0,{termID: currentTerm.value})
  }

}

const singleTableRef = ref<InstanceType<typeof ElTable>>()

const setCurrent = (row?: any) => {
  singleTableRef.value!.setCurrentRow(row)
}

const handleCurrentChange = (val: Course | undefined) => {
  currentCourse.value = val
  if (currentCourse.value){
    executeUser(0,{courseID: currentCourse.value.courseID})
  }
}
const UserVisible = reactive({
  visible: false
})
const showUser = () => {
  UserVisible.visible = true
}


</script>

<style scoped lang="scss">

.page-container {
  margin: 30px 30px;
}

.leftBox{
  border-right: 5px solid #c6c6c9;
}


.table-wrapper{
  margin-top: 20px;
}

.tableTitle{
  font-weight: bold;
  font-size: larger;
}

.header-container{
  display: flex;
  flex-wrap: nowrap;

  .alert{
    margin-left: 20px;
    width: 260px;
  }


}

</style>