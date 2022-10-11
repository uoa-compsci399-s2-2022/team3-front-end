<template>
  <el-drawer v-model="visible.visible" :show-close="false" size=80%>
    <template #header="{ titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass" style="font-size: x-large">Appoint position</h4>
    </template>
    <el-row justify="center">
      <el-icon :size="40" align-items: center>
        <User />
      </el-icon>
    </el-row>
    <br />

    <el-table :data="filterTableData" style="width: 100%" v-loading="tableLoading">
      <el-table-column label="ID" prop="id" width="100px" />
      <el-table-column label="Name" prop="name" width="100px" />
      <el-table-column label="Groups" prop="groups" width="200px" />
      <el-table-column>
        <template #header>
          <el-input v-model="search" size="small" placeholder="Type to search" />
        </template>
        <template #default="scope">
          <el-button size="small" @click="handleAddUser1(scope.row)">
            Appoint as Tutor
          </el-button>
          <el-button size="small" @click="handleAddUser2(scope.row)">
            Appoint as Marker
          </el-button>
          <el-button size="small" @click="handleAddUser3(scope.row)">
            Appoint as CourseCoordinator
          </el-button>
        </template>

      </el-table-column>
    </el-table>


  </el-drawer>




</template>

<script setup lang="ts">
import { computed, onBeforeMount, reactive, ref } from 'vue'
import { ElButton, ElDrawer, ElMessage } from 'element-plus'
import { CircleCloseFilled } from '@element-plus/icons-vue'
import { Delete, get, post } from "@/utils/request";
import { useRoute, useRouter } from 'vue-router';
import dayjs from "dayjs";



type Props = {
  visible: {visible: boolean};
  currentCourse: Course;
}


const props = defineProps<Props>()
const emit = defineEmits(['refresh'])



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

const form = reactive({} as Enrollment)


const handleAddUser1 = (row: User) => {
  addUserConfirmVisible.value = true;
  wantToAddUser.value = row;
  form.courseID = props.currentCourse.courseID
  form.userID = wantToAddUser.value.id
  form.role = "tutor"
  addUser()
}
const handleAddUser2 = (row: User) => {
  addUserConfirmVisible.value = true;
  wantToAddUser.value = row;
  form.courseID = props.currentCourse.courseID
  form.userID = wantToAddUser.value.id
  form.role = "marker"
  addUser()
}
const handleAddUser3 = (row: User) => {
  addUserConfirmVisible.value = true;
  wantToAddUser.value = row;
  form.courseID = props.currentCourse.courseID
  form.userID = wantToAddUser.value.id
  form.role = "courseCoordinator"
  addUser()
}

const addUser = () => {
  post('api/enrolment', form).then(r => {
    ElMessage({
      message: 'Add user success',
      type: 'success'
    })
    addUserConfirmVisible.value = false;
    emit('refresh')
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
@media (max-width: 540px) {}
</style>