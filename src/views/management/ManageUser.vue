<template>

  <div class="page-container">
    <div class="header-toolbar">
      <div>
        <el-button-group>
          <el-button type="primary" :icon="Plus" @click="showAddUser">Add User</el-button>
          <el-button type="primary" :icon="Ticket" @click="router.push('/manageuser/batch-invite-user')">Batch Invite
          </el-button>
        </el-button-group>
      </div>
      <div v-permission="5">
        <span style="color: #555a64; margin-left: 20px">Open for registration</span>
        <el-switch
            :loading="settingLoading"
            v-model="allowRegister"
            style="margin-left: 5px"
            inline-prompt
            :active-icon="Check"
            :inactive-icon="Close"
            @change="allowRegisterChange"
        />
      </div>
    </div>


    <el-table :data="filterTableData" style="width: 100%" v-loading="tableLoading">
      <el-table-column label="ID" prop="id"/>
      <el-table-column label="Email" prop="email"/>
      <el-table-column label="Name" prop="name"/>
      <el-table-column label="Groups" prop="groups"
                       :filters="[
                          { text: 'Admin', value: 'admin' },
                          { text: 'Tutor Coordinator', value: 'tutorCoordinator' },
                          { text: 'Marker Coordinator', value: 'markerCoordinator' },
                          { text: 'Course Coordinator', value: 'courseCoordinator' },
                          { text: 'Student', value: 'student' },
                        ]"
                       :filter-method="filterListHandler"
                       :filter-multiple="false"
      />
      <el-table-column align="right">
        <template #header>
          <el-input v-model="search" placeholder="Type to search user"/>
        </template>
        <template #default="scope">
          <div v-permission="5">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
            >Edit
            </el-button
            >
            <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
            >Delete
            </el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>

  </div>


  <el-dialog
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
  </el-dialog>
  <AddUser :visible="addUserVisible" @refreshUserTable="refresh"/>
  <EditUser :visible="editUserVisible" @refreshUserTable="refresh" :currentUser='wantToEditUser'
            v-if="editUserVisible.visible"/>
</template>

<script lang="ts" setup>
import {computed, onBeforeMount, reactive, ref, watch} from 'vue'
import {get, Delete, put} from "@/utils/request";
import dayjs from "dayjs";
import {Plus, Ticket, Check, Close} from '@element-plus/icons-vue'
import AddUser from '@/components/userUseful/AddUser.vue'
import EditUser from '@/components/userUseful/EditUser.vue'
import {ElMessage} from 'element-plus'
import {useRouter, useRoute} from "vue-router";
import {TableColumnCtx} from "element-plus/es/components/table/src/table-column/defaults";

const router = useRouter()
const route = useRoute()

const addUserVisible = reactive({
  visible: false
})
const editUserVisible = reactive({
  visible: false
})
const deleteConfirmVisible = ref(false)
const wantToDeleteUser = ref({} as User)
const wantToEditUser = ref({} as User)
const tableLoading = ref(true)
const allowRegister = ref(false)
const settingLoading = ref(false)

const showAddUser = () => {
  addUserVisible.visible = true
}

const filterListHandler = (
    value: string,
    row: User,
    column: TableColumnCtx<User>
) => {
  const property = column['property']
  return row[property].includes(value)
}


interface User {
  id: string
  email: string
  name: string
  groups: Array<string>
  createDateTime: string
}

const search = ref('')
const filterTableData = computed(() =>
    tableData.value.filter(
        (data) =>
            !search.value ||
            data.id.toLowerCase().includes(search.value.toLowerCase()) ||
            (data.email && data.email.toLowerCase().includes(search.value.toLowerCase())) ||
            (data.name && data.name.toLowerCase().includes(search.value.toLowerCase()))
    )
)
const handleEdit = (index: number, row: User) => {
  editUserVisible.visible = true
  wantToEditUser.value = row;
}


const handleDelete = (index: number, row: User) => {
  deleteConfirmVisible.value = true;
  wantToDeleteUser.value = row;

}

const deleteUser = () => {
  Delete('api/users/' + wantToDeleteUser.value.id).then(r => {
    ElMessage({
      message: 'Delete user success',
      type: 'success'
    })
    deleteConfirmVisible.value = false;
    getUser()
  }).catch(err => {
    ElMessage({
      message: err.response.data['message'],
      type: 'error'
    })
  })
}

const tableData = ref([] as User[])

const getUser = () => {
  tableLoading.value = true
  get('api/users').then((res) => {
    tableData.value = []
    res.forEach((e: User) => {
      tableData.value.push({
        id: e.id,
        email: e.email,
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

const getSetting = () => {
  settingLoading.value = true;
  get('api/setting').then((res) => {
    allowRegister.value = res.allowRegister
    settingLoading.value = false
  }).catch((e) => {
    ElMessage({
      message: e.response.data['message'],
      type: 'error'
    })
    settingLoading.value = false
  })
}

const allowRegisterChange = () => {
  const newVal = allowRegister.value
  settingLoading.value = true;
  if (typeof newVal === "boolean") {
    put('api/setting', {
      data: {allowRegister: newVal}
    }).then((res) => {
      refresh()
      ElMessage({
        message: 'Update setting success',
        type: 'success'
      })
    }).catch((e) => {
      refresh()
      if (e.response.status === 401) {
        router.push('/login')
        return
      }
      if (e.response.status === 403) {
        ElMessage({
          message: 'Unauthorized Access',
          type: 'error'
        })
        return;
      }
      ElMessage({
        message: e.response.data['message'],
        type: 'error'
      })

    })
  }
}


const refresh = () => {
  getUser()
  getSetting()
}


onBeforeMount(() => {
  getUser()
  getSetting()
})

</script>


<style scoped>

.page-container {
  margin: 30px 30px;
}

.header-toolbar {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}

</style>

