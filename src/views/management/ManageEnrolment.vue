<template>
  <div class="page-container">
    <el-row class="header-container">
      <el-select v-model="currentTerm" @change="handleTermChange" class="m-2" placeholder="Select Term" size="large"
        v-loading="isLoadingTerm">
        <el-option v-for="item in stateTerm" :key="item.termName" :label="item.termName" :value="item.termID" />
      </el-select>
      <el-alert class="alert" title="Tips: Please Select Term First" type="warning" show-icon />
    </el-row>

    <el-row :gutter="22" class="table-wrapper">
      <el-col :span="12" class="leftBox">
        <el-row justify="center">
          <span class="tableTitle">Course List</span>
        </el-row>

        <el-table v-loading="isLoadingCourse" ref="singleTableRef" :data="stateCourse" highlight-current-row
          style="width: 100%" @current-change="handleCurrentChange">
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
          <el-table-column property="id" label="ID" width="100" />
          <el-table-column property="email" label="Email" width="250" />
          <el-table-column property="name" label="Name" />
          <el-table-column label="Position" >
            <template #default="scope">
              <el-tag>
                {{scope.row.roleInCourse}}
              </el-tag>
            </template>

          </el-table-column>
          <!-- <el-table-column>
            <template #default="scope">
              <el-button size="small" @click="handleremove(scope.row)" type="danger">
                Remove
              </el-button>
            </template>

          </el-table-column> -->
          <template #empty>
            <el-empty description="No Data" />
          </template>
        </el-table>
        <el-row justify="center" v-if="isReadyUser" style="margin-top: 10px">
          <el-button @click="showUser" type="primary" :icon="Plus" style="margin-left: 16px ;">Appoint position
          </el-button>
        </el-row>
      </el-col>
    </el-row>

  </div>

  <AddUserDrawer :visible="UserVisible" direction="ltr" 
  :currentCourse="currentCourse"
   v-if="UserVisible.visible" @refresh="freshtable"
   :user-role-arr="userRoleArr"
   />

  <!-- <el-dialog
      v-model="deleteConfirmVisible"
      title="Delete Confirm"
      width="30%"
  >
    <span>Please confirm to delete the user: {{ wantToDeleteUser.id }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="deleteConfirmVisible = false">Cancel</el-button>
        <el-button type="danger" @click="deleteUser"
        >Confirm</el-button
        >
      </span>
    </template>
  </el-dialog> -->
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { useAsyncState } from '@vueuse/core'
import { get} from "@/utils/request";
import { ElTable } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import AddUserDrawer from '@/components/ManageUseful/AddUserDrawer.vue'

interface User {
  id: string
  email: string
  name: string
  roleInCourse: string
}
const currentTerm = ref<Term>();
const currentCourse = ref<Course>();
const  deleteConfirmVisible = ref(false)
const wantToDeleteUser = ref({} as User)
// const handleremove = (row: User) => {
//   deleteConfirmVisible.value = true;
//   wantToDeleteUser.value = row;

// }
// type deleteform = {
//   courseID: number
//   userID: string
//   role:string
// }
// const  form = reactive({} as deleteform)
// const deleteUser = () => {
//   form.courseID = currentCourse.value.courseID
//   form.userID = wantToDeleteUser.value.id
//   form.role = wantToDeleteUser.value.roleInCourse

//   Delete('/api/enrolment',{data:form}).then(r => {
//     ElMessage({
//       message: 'Remove user success',
//       type: 'success'
//     })
//     deleteConfirmVisible.value = false;
//     freshtable()
//   }).catch(err => {
//     ElMessage({
//       message: err.response.data['message'],
//       type: 'error'
//     })
//   })
// }
const { isLoading:isLoadingTerm, state:stateTerm, isReady:isReadyTerm, execute:executeTerm } = useAsyncState(
    (args) => {
      return get('api/term')
    },
    {},
    {
      resetOnExecute: false,
    },
)

const { isLoading: isLoadingCourse, state: stateCourse, isReady: isReadyCourse, execute: executeCourse } = useAsyncState(
  (args) => {
    const termID = args.termID
    return get('api/getCourseByTerm/' + termID);
  },
  [],
  {
    resetOnExecute: false,
    immediate: false
  },
)

const { isLoading: isLoadingUser, state: stateUser, isReady: isReadyUser, execute: executeUser } = useAsyncState(
  (args) => {
    const courseID = args.courseID
    return get(`api/getCourseUser/${courseID}/true`);
  },
  [],
  {
    resetOnExecute: false,
    immediate: false
  },
)

const handleTermChange = () => {
  if (currentTerm.value) {
    executeCourse(0, { termID: currentTerm.value })
  }

}

const singleTableRef = ref<InstanceType<typeof ElTable>>()

const setCurrent = (row?: any) => {
  singleTableRef.value!.setCurrentRow(row)
}

const handleCurrentChange = (val: Course | undefined) => {
  currentCourse.value = val
  if (currentCourse.value) {
    executeUser(0, { courseID: currentCourse.value.courseID })
  }
}
const UserVisible = reactive({
  visible: false
})
const showUser = () => {
  UserVisible.visible = true
}
const freshtable = () => {
  executeUser(0,{courseID: currentCourse.value.courseID})
}

// 每个元素：[用户id, 用户在这门课的权限]
// [["aiden", ["tutor"]], ["jack", ["tutor", "marker"]]]
let userRoleArr = ref<any[][]>([])

watch(stateUser, _ => {
  userRoleArr.value.length = 0;
  for (let user of stateUser.value) {
    let hasThisUser = false;
    for (let i=0; i<userRoleArr.value.length; i++) {
      let item = userRoleArr.value[i]
      if (item[0] == user.id) {
        userRoleArr.value[i][1].push(user.roleInCourse)
        hasThisUser = true;
        break
      }
    }

    if (!hasThisUser) {
      userRoleArr.value.push([user.id, [user.roleInCourse]])
    }
  }

})


</script>

<style scoped lang="scss">
.page-container {
  margin: 30px 30px;
}

.leftBox {
  border-right: 5px solid #c6c6c9;
}


.table-wrapper {
  margin-top: 20px;
}

.tableTitle {
  font-weight: bold;
  font-size: larger;
}

.header-container {
  display: flex;
  flex-wrap: nowrap;

  .alert {
    margin-left: 20px;
    width: 260px;
  }


}
</style>