<template>

  <div class="page-container">
    <el-button type="primary" :icon="Plus">Add User</el-button>
    <el-table :data="filterTableData" style="width: 100%">
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
</template>

<script lang="ts" setup>
import {computed, onBeforeMount, ref} from 'vue'
import {get} from "@/utils/request";
import dayjs from "dayjs";
import {Plus} from '@element-plus/icons-vue'

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
  console.log(index, row)
}

const tableData = ref([] as User[])

get('api/users').then((res) => {
  console.log(res)
  res.forEach((e: User) => {
    tableData.value.push({
      id: e.id,
      email: e.email,
      name: e.name,
      groups: e.groups,
      createDateTime: dayjs(e.createDateTime).format('DD-MM-YYYY HH:mm:ss')
    })
  })
})


</script>


<style scoped>

.page-container {
  margin: 30px 30px;
}

</style>

