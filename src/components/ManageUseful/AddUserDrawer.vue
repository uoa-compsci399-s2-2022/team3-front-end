<template>
  <el-drawer v-model="visible.visible" :show-close="false" size=60%>
    <template #header="{ titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass" style="font-size: x-large">Add User</h4>
    </template>
    <el-row justify="center" >
      <el-icon :size="40" align-items: center ><User /></el-icon>
    </el-row>
    <br/>

    <el-table :data="filterTableData" style="width: 100%" v-loading="tableLoading" >
      <el-table-column label="ID" prop="id" width="150px"/>
      <el-table-column label="Name" prop="name" width="150px"/>
      <el-table-column label="Groups" prop="groups" width="200px"/>
      <el-table-column >
        <template #header>
          <el-input v-model="search" size="small" placeholder="Type to search"/>
        </template>
          <el-button size="small" @click="handleAddUser1(scope.$index, scope.row)" type="danger">
            Add Tutor
          </el-button>
          <el-button size="small" @click="handleAddUser2(scope.$index, scope.row)" type="danger">
            Add Marker
          </el-button>
          <el-button size="small" @click="handleAddUser3(scope.$index, scope.row)" type="danger">
            Add CourseCoordinator
          </el-button>

      </el-table-column>
    </el-table>


  </el-drawer>




</template>

<script setup lang="ts">
import {computed, onBeforeMount, reactive, ref} from 'vue'
import {ElButton, ElDrawer, ElMessage} from 'element-plus'
import {CircleCloseFilled} from '@element-plus/icons-vue'
import {Delete, get, post} from "@/utils/request";
import {useRoute, useRouter} from 'vue-router';
import dayjs from "dayjs";





type Props = {
  visible: object
  currentCourse: Course
}


const props = defineProps<Props>()



const router = useRouter()

const tableLoading = ref(true)


interface User {
  id: string
  name: string
  groups: Array<string>
  createDateTime: string
}

const search = ref('')
const filterTableData = computed(() =>
    tableData.value.filter(
        (data) =>
            !search.value ||
            data.id.toLowerCase().includes(search.value.toLowerCase())
    )
)



const tableData = ref([] as User[])

const getUser = () => {
  get('api/users').then((res) => {
    tableData.value = []
    res.forEach((e: User) => {
      tableData.value.push({
        id: e.id,
        name: e.name,
        groups: e.groups,
        createDateTime: dayjs(e.createDateTime).format('DD-MM-YYYY HH:mm:ss')
      })
    })
    tableLoading.value = false
  }).catch((e) => {
    console.log(e)
  })
}

const addUserConfirmVisible = ref(false)
const wantToAddUser = ref({} as User)

type Enrollment = {
  courseID: number
  userID: string
  role: string
}

const form = reactive ({} as Enrollment)


const handleAddUser1 = (index: number, row: User) => {
  addUserConfirmVisible.value = true;
  wantToAddUser.value = row;
  form.courseID=props.currentCourse.courseID
  form.userID=wantToAddUser.value.id
  form.role="tutor"
  addUser()
}
const handleAddUser2 = (index: number, row: User) => {
  addUserConfirmVisible.value = true;
  wantToAddUser.value = row;
  form.courseID=props.currentCourse.courseID
  form.userID=wantToAddUser.value.id
  form.role="maker"
  addUser()
}
const handleAddUser3 = (index: number, row: User) => {
  addUserConfirmVisible.value = true;
  wantToAddUser.value = row;
  form.courseID=props.currentCourse.courseID
  form.userID=wantToAddUser.value.id
  form.role="courseCoordinator"
  addUser()
}

const addUser = () => {
  post('api/enrolment', form).then(r => {
    ElMessage({
      message: 'Add user success',
      type: 'success'
    })
    addUserConfirmVisible.value = false;
  }).catch(err => {
    ElMessage({
      message: err.response.data['message'],
      type: 'error'
    })
  })
}

const refresh = () => {
  getUser()
}

getUser()

</script>

<style scoped>


@media (max-width: 540px) {

}

</style>