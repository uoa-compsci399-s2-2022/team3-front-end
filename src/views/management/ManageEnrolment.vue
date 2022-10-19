<template>
  <div class="page-container">
    <el-row class="header-container">
      <el-select v-model="currentTerm" @change="handleTermChange" class="m-2" placeholder="Select Term" size="large"
                 v-loading="isLoadingTerm" no-data-text="No Term">
        <el-option v-for="item in stateTerm" :key="item.termName" :label="item.termName" :value="item.termID"/>
      </el-select>
      <el-alert class="alert" title="Tips: Please Select Term First" type="warning" show-icon/>
    </el-row>

    <el-row :gutter="22" class="table-wrapper">
      <el-col :span="9" class="leftBox">
        <el-row justify="center">
          <span class="tableTitle">Course List</span>
        </el-row>
        <el-table v-loading="isLoadingCourse" ref="singleTableRef" :data="stateCourse" highlight-current-row
                  style="width: 100%; height: calc(100vh - 255px)" @current-change="handleCurrentChange"
                  :show-header="false">
          <el-table-column property="courseNum" label="Course Num" width="135"/>
          <el-table-column property="courseName" label="Course Name" show-overflow-tooltip/>
          <template #empty>
            <el-empty description="No Data"/>
          </template>
        </el-table>

      </el-col>

      <el-col :span="15" style="margin-bottom: 70px">
        <el-row justify="center">
          <span class="tableTitle">User List</span>
        </el-row>

        <el-table v-loading="isLoadingUser" ref="singleTableRef" :data="stateUser" highlight-current-row
                  style="width: 100%">
          <el-table-column property="id" label="ID" width="100"/>
          <el-table-column property="email" label="Email" width="230"/>
          <el-table-column property="name" label="Name"/>
          <el-table-column label="Position" width="150">
            <template #default="scope">
              <el-tag>
                {{ scope.row.roleInCourse }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Estimated Hours" width="140">
            <template #default="scope">
              <el-input-number style="width: 100px" v-model="scope.row.estimatedHours" :min="0"
                               @change="modifyEstimatedHour(scope.row.estimatedHours, scope.row)"
                               v-if="scope.row.roleInCourse !== 'courseCoordinator'" controls-position="right"/>
            </template>
          </el-table-column>
          <el-table-column>
            <template #default="scope">
              <el-button @click="handleremove(scope.row)" type="danger" :icon="Delete" circle/>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty description="No Data"/>
          </template>
        </el-table>
        <el-row justify="center" v-if="isReadyUser" class="add-button-wrapper">
          <el-button @click="showUser" type="primary" :icon="Plus" style="margin-left: 16px;">Appoint position
          </el-button>
        </el-row>
      </el-col>
    </el-row>

  </div>

  <AddUserDrawer :visible="UserVisible" direction="ltr" :currentCourse="currentCourse" v-if="UserVisible.visible"
                 @refresh="freshtable" :user-role-arr="userRoleArr"/>

  <el-dialog
      v-model="deleteConfirmVisible"
      title="Delete Confirm"
      width="30%"
  >
    <span>Please confirm to delete the user '{{ wantToDeleteUser.id }}' from the course</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="deleteConfirmVisible = false">Cancel</el-button>
        <el-button type="danger" @click="deleteUser"
        >Confirm</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {onBeforeMount, reactive, ref, watch} from "vue";
import {useAsyncState} from '@vueuse/core'
import {get, Delete as delete_request, put} from "@/utils/request";
import {ElTable, ElMessage} from 'element-plus'
import {Plus, Delete} from '@element-plus/icons-vue'
import AddUserDrawer from '@/components/ManageUseful/AddUserDrawer.vue'
import {usePermissionStore} from "@/store";
import {floor} from "xe-utils";

interface User {
  id: string
  email: string
  name: string
  roleInCourse: string
  estimatedHours: number
}

const currentTerm = ref();
const currentCourse = ref<Course>();
const deleteConfirmVisible = ref(false)
const wantToDeleteUser = ref({} as User)
const handleremove = (row: User) => {
  deleteConfirmVisible.value = true;
  wantToDeleteUser.value = row;
}
type deleteform = {
  courseID: number
  userID: string
  role: string
}
const form = reactive({} as deleteform)
const deleteUser = () => {
  form.courseID = currentCourse.value.courseID
  form.userID = wantToDeleteUser.value.id
  form.role = wantToDeleteUser.value.roleInCourse

  delete_request('/api/enrolment', {data: form}).then(r => {
    ElMessage({
      message: 'Remove user success',
      type: 'success'
    })
    deleteConfirmVisible.value = false;
    freshtable()
  }).catch(err => {
    ElMessage({
      message: err.response.data['message'],
      type: 'error'
    })
  })
}

const {isLoading: isLoadingTerm, state: stateTerm, isReady: isReadyTerm, execute: executeTerm} = useAsyncState(
    (args) => {
      return get('api/term')
    },
    {},
    {
      resetOnExecute: false,
    },
)

const {isLoading: isLoadingCourse, state: stateCourse, isReady: isReadyCourse, execute: executeCourse} = useAsyncState(
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


const {isLoading: isLoadingUser, state: stateUser, isReady: isReadyUser, execute: executeUser} = useAsyncState(
    (args) => {
      const courseID = args.courseID
      // return get(`api/getCourseUser/${courseID}/true`);
      return get(`api/getCourseUserWithPublishInformation/${courseID}`)
    },
    [],
    {
      resetOnExecute: false,
      immediate: false
    },
)


const handleTermChange = () => {
  if (currentTerm.value) {
    executeCourse(0, {termID: currentTerm.value})
    localStorage.setItem('selectedTerm', currentTerm.value)
  }

}

const singleTableRef = ref<InstanceType<typeof ElTable>>()

const setCurrent = (row?: any) => {
  singleTableRef.value!.setCurrentRow(row)
}

const handleCurrentChange = (val: Course | undefined) => {
  currentCourse.value = val
  if (currentCourse.value) {
    executeUser(0, {courseID: currentCourse.value.courseID})
  }
}
const UserVisible = reactive({
  visible: false
})
const showUser = () => {
  UserVisible.visible = true
}

const freshtable = () => {
  executeUser(0, {courseID: currentCourse.value!.courseID})
}

type role = {
  role: string,
  isPublished: boolean,
}

type roleInfo = {
  id: string;
  roles: role[];
};

let userRoleArr = ref<roleInfo[]>([])

watch(stateUser, _ => {
  userRoleArr.value.length = 0;
  for (let user of stateUser.value) {
    let hasThisUser = false;
    for (let i = 0; i < userRoleArr.value.length; i++) {
      let item = userRoleArr.value[i]
      if (item.id == user.id) {
        userRoleArr.value[i].roles.push({
          role: user.roleInCourse,
          isPublished: user.isPublished,
        })
        hasThisUser = true;
        break
      }
    }
    if (!hasThisUser) {
      userRoleArr.value.push({
        id: user.id,
        roles: [{
          role: user.roleInCourse,
          isPublished: user.isPublished,
        }],
      })
    }
  }
})


const modifyEstimatedHour = (currentValue, row:User) => {
  put(`api/modifyEstimatedHours/${currentCourse.value.courseID}/${row.id}/${row.roleInCourse}/${currentValue}`, {}).then(r => {
    ElMessage({
      message: 'Modify estimated hour success',
      type: 'success'
    })
    freshtable()
  }).catch(err => {
    ElMessage({
      message: err.response.data['message'],
      type: 'error'
    })
  })


}

onBeforeMount(() => {
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
          currentTerm.value = stateTerm.value.filter((t: { termID: number; }) => t.termID === parseInt(localTerm!))[0].termID
        } else {
          currentTerm.value = stateTerm.value[0].termID
        }
        executeCourse(0, {termID: currentTerm.value})
      }
  )
})


</script>

<style scoped lang="scss">
.page-container {
  margin: 30px 30px 0;
}

.leftBox {
  border-right: 5px solid #f3f3f3;
}


.table-wrapper {
  margin-top: 20px;
}

.tableTitle {
  font-weight: bold;
  font-size: larger;
  color: #75787e;
  margin-bottom: 10px;
}

.header-container {
  display: flex;
  flex-wrap: nowrap;

  .alert {
    margin-left: 20px;
    width: 260px;
  }
}

.add-button-wrapper {
  margin-bottom: 20px;
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 1;
}
</style>