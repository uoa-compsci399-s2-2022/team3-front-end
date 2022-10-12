<template>
  <el-drawer v-model="visible.visible" :show-close="false" size=60%>
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
          <!-- <el-button size="small" @click="handleAddUser1(scope.row)">
            Appoint as Tutor
          </el-button>
          <el-button size="small" @click="handleAddUser2(scope.row)">
            Appoint as Marker
          </el-button>
          <el-button size="small" @click="handleAddUser3(scope.row)">
            Appoint as CourseCoordinator
          </el-button> -->
          <el-select v-model="roles[scope.$index]" multiple :placeholder="`Appoint position for ${scope.row.name}`"
            style="width: 240px" @change="role => appointPosition(role, scope.row)"
            @remove-tag="role => dismissPosition(role, scope.row)">

            <el-option key="marker" label="Marker" value="marker" />
            <el-option key="tutor" label="Tutor" value="tutor" />
            <el-option key="student" label="Student" value="student" />
            <el-option key="courseCoordinator" label="Course Coordinator" value="courseCoordinator" />
          </el-select>
        </template>

      </el-table-column>
    </el-table>


  </el-drawer>




</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElDrawer, ElMessage } from 'element-plus'
import { Delete, get, post } from "@/utils/request";
import dayjs from "dayjs";



type Props = {
  visible: { visible: boolean };
  currentCourse: Course;
  userRoleArr: any[][];
}


const props = defineProps<Props>()
const emit = defineEmits(['refresh'])

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

const getUser = async () => {
  return get('api/users').then((res) => {
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

// const addUserConfirmVisible = ref(false)
// const wantToAddUser = ref({} as User)

type Enrollment = {
  courseID: number
  userID: string
  role: string
}

// const form = reactive({} as Enrollment)


// const handleAddUser1 = (row: User) => {
//   addUserConfirmVisible.value = true;
//   wantToAddUser.value = row;
//   form.courseID = props.currentCourse.courseID
//   form.userID = wantToAddUser.value.id
//   form.role = "tutor"
//   addUser()
// }
// const handleAddUser2 = (row: User) => {
//   addUserConfirmVisible.value = true;
//   wantToAddUser.value = row;
//   form.courseID = props.currentCourse.courseID
//   form.userID = wantToAddUser.value.id
//   form.role = "marker"
//   addUser()
// }
// const handleAddUser3 = (row: User) => {
//   addUserConfirmVisible.value = true;
//   wantToAddUser.value = row;
//   form.courseID = props.currentCourse.courseID
//   form.userID = wantToAddUser.value.id
//   form.role = "courseCoordinator"
//   addUser()
// }

// const addUser = () => {
//   post('api/enrolment', form).then(r => {
//     ElMessage({
//       message: 'Add user success',
//       type: 'success'
//     })
//     addUserConfirmVisible.value = false;
//     emit('refresh')
//   }).catch(err => {
//     ElMessage({
//       message: err.response.data['message'],
//       type: 'error'
//     })
//   })
// }

// const refresh = () => {
//   getUser()
// }


const roles = ref<any[][]>([])


const getUserRoles = async () => {
  await getUser()
  for (let i = 0; i < tableData.value.length; i++) {
    for (let user of props.userRoleArr) {
      if (tableData.value[i].id === user[0]) {
        roles.value[i] = user[1];
        break;
      }
    }
  }
}

getUserRoles()

const deleting = ref<boolean>(false);
const appointPosition = async (role: string[], user: User) => {
  await new Promise(resolve => setTimeout(() => { resolve("") }, 100)); //等个0.1秒检查这次操作是增加还是删除
  if (!deleting.value) {
    const data: Enrollment = {
      courseID: props.currentCourse.courseID,
      userID: user.id,
      role: role.at(-1)!,
    }
    post('api/enrolment', data).then(_ => {
      ElMessage({
        message: `${user.name} is appoint as an ${role.at(-1)} now!`,
        type: 'success'
      })
      emit("refresh")
    }).catch(err => {
      ElMessage({
        message: err.response.data['message'],
        type: 'error'
      })
    })
  } else {
    console.log("deleting!!!")
  }
}

type dismissal = {
    courseID: number;
    role:     string;
    userID:   string;
}


const dismissPosition = async (role: string, user: User) => {
  deleting.value = true;
  const data: dismissal = {
      courseID: props.currentCourse.courseID,
      userID: user.id,
      role: role!,
    }

  Delete('/api/enrolment', {data: data}).then(_ => {
      ElMessage({
        message: `${user.name} has been dismissed from ${role} position.`,
        type: 'success'
      })
    emit("refresh")
    }).catch(err => {
      ElMessage({
        message: err.response.data['message'],
        type: 'error'
      })
    })
  await new Promise(resolve => setTimeout(() => { resolve("") }, 110)); //缓冲0.11秒
  deleting.value = false;
}
</script>

<style scoped>
@media (max-width: 540px) {}
</style>