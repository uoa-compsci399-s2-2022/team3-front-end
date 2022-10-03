<template>

  <div class="page-container">
    <el-button type="primary" :icon="Plus" @click="showAddUser">Add User</el-button>
    <el-table :data="filterTableData" style="width: 100%" v-loading="tableLoading">
      <el-table-column label="ID" prop="id"/>
      <el-table-column label="Email" prop="email"/>
      <el-table-column label="Name" prop="name"/>
      <el-table-column label="Groups" prop="groups"/>
      <el-table-column align="right">
        <template #header>
          <el-input v-model="search" size="small" placeholder="Type to search"/>
        </template>
        <template #default="scope">
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
        </template>
      </el-table-column>
    </el-table>

  </div>


  <el-dialog
      v-model="deleteConfirmVisible"
      title="Delete Confirm"
      width="30%"
  >
    <span>Please confirm to delete the user: {{wantToDeleteUser.id}}</span>
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
</template>

<script lang="ts" setup>
import {computed, onBeforeMount, reactive, ref} from 'vue'
import {get, Delete} from "@/utils/request";
import dayjs from "dayjs";
import {Plus} from '@element-plus/icons-vue'
import AddUser from '@/components/userUseful/AddUser.vue'
import {ElMessage} from 'element-plus'

const addUserVisible = reactive({
  visible: false
})
const deleteConfirmVisible = ref(false)
const wantToDeleteUser = ref({} as User)
const tableLoading = ref(true)

const showAddUser = () => {
  addUserVisible.visible = true
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
            data.id.toLowerCase().includes(search.value.toLowerCase())
    )
)
const handleEdit = (index: number, row: User) => {
  console.log(index, row)
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

const getUser = () =>{
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



const refresh = () => {
  getUser()
}

getUser()

</script>


<style scoped>

.page-container {
  margin: 30px 30px;
}

</style>

