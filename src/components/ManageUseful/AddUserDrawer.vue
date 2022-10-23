<template>
  <el-drawer v-model="visible.visible" :show-close="false" size=60%>
    <template #header="{ titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass" style="font-size: x-large">Appoint position</h4>
    </template>
    <el-row justify="center">
      <el-icon :size="40" align-items="center">
        <User />
      </el-icon>
    </el-row>
    <br />
    <el-alert title="Notice" description="Position ending with '(not published)' means the position has been approved."
      show-icon />
    <el-table :data="search ? tableDataFilter.filteredData : tableData" style="width: 100%" v-loading="tableLoading">
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
          <el-select v-model="filteredRoles[scope.$index]" multiple
            :placeholder="`Appoint position for ${scope.row.name}`" style="width: 240px"
            @change="role => appointPositionSearched(role, scope.row, scope.$index)" v-if="search">
            <el-option key="marker" label="Marker" value="marker" />
            <el-option key="tutor" label="Tutor" value="tutor" />
            <el-option key="courseCoordinator" label="Course Coordinator" value="courseCoordinator" />
          </el-select>

          <el-select v-model="roles[scope.$index]" multiple :placeholder="`Appoint position for ${scope.row.name}`"
            style="width: 240px" @change="role => appointPosition(role, scope.row, scope.$index)" v-else>

            <el-option key="marker" label="Marker" value="marker" />
            <el-option key="tutor" label="Tutor" value="tutor" />
            <el-option key="courseCoordinator" label="Course Coordinator" value="courseCoordinator" />
          </el-select>

        </template>

      </el-table-column>
    </el-table>


  </el-drawer>




</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { ElDrawer, ElMessage, ElMessageBox } from 'element-plus'
import { Delete, get, post, put } from "@/utils/request";
import dayjs from "dayjs";
import { cloneDeep } from 'lodash';
import { watchDebounced } from '@vueuse/core'


type Props = {
  visible: { visible: boolean };
  currentCourse: Course;
  userRoleArr: roleInfo[];
}

type role = {
  role: string,
  isPublished: boolean,
}

type roleInfo = {
  id: string;
  roles: role[];
};


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


const tableDataFilter = reactive({
  filteredData: [],
  filteredindex: []
})
watchDebounced(search, () => {
  tableDataFilter.filteredindex.length = 0;
  tableDataFilter.filteredData = tableData.value.filter(
    (data, index) => {
      if (!search.value ||
        data.id.toLowerCase().includes(search.value.toLowerCase())) {
        tableDataFilter.filteredindex.push(index)
        return true
      }
    }
  );
  filteredRoles.value.length = 0;
  for (let i of tableDataFilter.filteredindex) {
        filteredRoles.value.push(roles.value[i])
      }
}, { debounce: 1000 })


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


const roles = ref<any[][]>([])
let rolesCopy: any[][] = []

const getUserRoles = async () => {
  await getUser()
  for (let i = 0; i < tableData.value.length; i++) {
    for (let user of props.userRoleArr) {
      if (tableData.value[i].id === user.id) {
        roles.value[i] = user.roles.map(role => {

          if (!role.isPublished) {
            return role.role + "(not published)";
          }
          return role.role
        });
        break;
      }
    }
  }
  rolesCopy = cloneDeep(roles.value)
}

getUserRoles()


const filteredRoles = ref<any[][]>([])
watch(roles, () => {
  filteredRoles.value.length = 0;
  if (search.value) {
      for (let i of tableDataFilter.filteredindex) {
        filteredRoles.value.push(roles.value[i])
      }
    }
})


const appointPosition = async (role: string[], user: User, index: number) => {
  // element to delete
  let toDelete: string | null = null;
  // if its a delete operation
  if (rolesCopy[index].length > roles.value[index].length) {
    let set = new Set(roles.value[index])
    for (let item of rolesCopy[index]) {
      if (!set.has(item)) {
        toDelete = item;
      }
    }
  }
  const data = {
    courseID: props.currentCourse.courseID,
    userID: user.id,
    role: role,
  }
  let arr: string[] = [];
  data.role = role.filter(role => {
    if (role.match(/.*\(not published\)$/)) {
      arr.push(role.replace('(not published\)', ''))
    } else {
      return role
    }
  })

  if (arr.length > 0 || (toDelete !== null && toDelete.match(/.*\(not published\)$/))) {
    ElMessageBox.confirm(
      `You have unpublished position(s) '${arr.join(' ')}'. \n You can wait for its publication. \n Are you sure you want to add now?`,
      'Warning',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    ).then(() => {
      roles.value[index] = cloneDeep(data.role);
      put('/api/enrolment', { data: data }).then(_ => {
        rolesCopy = cloneDeep(roles.value);
        ElMessage({
          message: `${user.name}'s positions has been updated.'`,
          type: 'success'
        })
        emit('refresh')
      }).catch(err => {
        ElMessage({
          message: err.response.data['message'],
          type: 'error'
        })
      })
    }).catch(() => {
      if (rolesCopy[index].length < roles.value[index].length) {
        roles.value[index].pop();
      } else {
        roles.value[index] = cloneDeep(rolesCopy[index])
      }
      ElMessage({
        message: 'Canceled.',
        type: 'info'
      })
    })
  } else {
    put('/api/enrolment', { data: data }).then(_ => {
      rolesCopy = cloneDeep(roles.value);
      ElMessage({
        message: `${user.name}'s positions has been updated.'`,
        type: 'success'
      })
      emit('refresh')
    }).catch(err => {
      ElMessage({
        message: err.response.data['message'],
        type: 'error'
      })
    })
  }
}

const appointPositionSearched = (role: string[], user: User, index: number) => {
  appointPosition(role, user, tableDataFilter.filteredindex[index]);
}

// type dismissal = {
//   courseID: number;
//   role: string;
//   userID: string;
// }


</script>

<style scoped>
@media (max-width: 540px) {}
</style>