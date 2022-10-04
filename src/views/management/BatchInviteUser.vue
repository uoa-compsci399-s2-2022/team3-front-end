<template>

  <div class="page-container">
    <el-row>
      <el-col :span="20">
        <div class="table-wrapper">
          <vxe-table
              ref="tableRef"
              border
              keep-source
              height="100%"
              :data="tableData"
              :column-config="{resizable: true}"
              :edit-config="{trigger: 'click', mode: 'row', showStatus: true}"
              :sort-config="{trigger: 'cell', defaultSort: {field: 'age', order: 'desc'}, orders: ['desc', 'asc', null]}"
              @edit-closed="editClosedEvent">
            <vxe-column title="#" width="60" field="index"></vxe-column>
            <vxe-column field="userID" title="UserID (UPI)" :edit-render="{}">
              <template #edit="{ row }">
                <vxe-input v-model="row.userID"></vxe-input>
              </template>
            </vxe-column>
            <vxe-column field="email" title="Email" :edit-render="{}">
              <template #edit="{ row }">
                <vxe-input v-model="row.email"></vxe-input>
              </template>
            </vxe-column>
            <vxe-column field="name" title="Name" :edit-render="{}">
              <template #edit="{ row }">
                <vxe-input v-model="row.name"></vxe-input>
              </template>
            </vxe-column>
            <vxe-column field="groups" title="Groups" :edit-render="{}">
              <template #edit="{ row }">
                <vxe-select v-model="row.groups" placeholder="Select Groups" multiple>
                  <vxe-option :value="g.groupName" :label="g.groupName" v-for="g in groups"></vxe-option>
                </vxe-select>
              </template>
            </vxe-column>
            <template #empty>
              <el-empty description="Please add users who need to be invited!"/>
            </template>
          </vxe-table>
        </div>

      </el-col>


      <el-col :span="4">

        <el-row justify="center" class="button-wrapper">
          <el-button class="button" :icon="DocumentChecked" type="warning" @click="saveEvent">Save</el-button>
        </el-row>

        <el-row justify="center" class="button-wrapper">
          <el-button class="button" type="primary" :icon="Plus" @click="addRow(null)">Add Row</el-button>
        </el-row>

        <el-row justify="center" class="button-wrapper">
          <el-button class="button" type="primary" @click="addRow('student')">Add Student</el-button>
        </el-row>

        <el-row justify="center" class="button-wrapper">
          <el-button class="button" type="primary" @click="addRow('courseCoordinator')">Add CourseCoord</el-button>
        </el-row>




        <el-row justify="center" class="SendButton-wrapper">
          <el-button class="button" type="success" :icon="Promotion" size="large" @click="send">Send</el-button>
        </el-row>


      </el-col>


    </el-row>


  </div>


</template>

<script setup lang="ts">
import {Plus, Promotion, DocumentChecked} from "@element-plus/icons-vue";
import {VXETable, VxeTableInstance, VxeTableEvents} from "vxe-table";
import {ref, reactive, toRefs} from 'vue'
import {get, post} from "@/utils/request";
import {ElMessage} from "element-plus";


const tableRef = ref<VxeTableInstance>()
const tableLoading = ref(false)
type InviteUser = {
  index: number,
  userID: string
  email: string,
  name: string,
  groups: Array<string>
}


const tableData = ref([] as InviteUser[])


const editClosedEvent: VxeTableEvents.EditClosed = ({row, column}) => {
  const $table = tableRef.value

  console.log(tableData.value)
}

const addRow = async (group: string | null) => {
  let user: InviteUser;
  const $table = tableRef.value
  if (group === null) {
    user = {
      index: tableData.value.length + 1,
      userID: '',
      email: '',
      name: '',
      groups: []
    }
  } else {
    user = {
      index: tableData.value.length + 1,
      userID: '',
      email: '',
      name: '',
      groups: [group]
    }
  }
  const {row: newRow} = await $table.insertAt(user, -1)
  await $table?.setEditCell(newRow, 'userID')
  tableData.value.push(user)
}


type Group = {
  groupID: number
  groupName: string
}
const groups = ref([] as Group[])

get('api/groups').then((res) => {
  groups.value = res;
})


const send = async () => {
  await saveEvent()
  get('api/inviteUser').then((res) => {
    console.log(res)
    ElMessage({
      message: '',
      type: 'success'
    })
  }).catch((err) => {
    console.log(err)
    ElMessage({
      message: err.response.data['message'],
      type: 'error'
    })
  })
}

const saveEvent = async () => {
  const $table = tableRef.value
  const {insertRecords, removeRecords, updateRecords} = $table.getRecordset()
  if (insertRecords.length <= 0 && removeRecords.length <= 0 && updateRecords.length <= 0) {
    ElMessage({
      message: 'No changes',
      type: 'warning'
    })
    return
  }
  const errMap = await $table?.validate()
  if (errMap) {
    return
  }
  tableLoading.value = true
  try {
    const body = {insertRecords, removeRecords, updateRecords}
    await post('api/inviteUserSaved', body).then(
        (res) => {
          ElMessage({
            message: 'Save success',
            type: 'success'
          })
        }).catch((err) => {
      ElMessage({
        message: err.response.data['message'],
        type: 'error'
      })
    })
    await loadList()
  } catch (e:any) {
    if (e && e.message) {
      ElMessage({
        message: e.message,
        type: 'error'
      })
    }
  }
  tableLoading.value = false
}

const loadList = async () => {
  tableLoading.value = true
  try {
    const res:InviteUser[] = await get('api/inviteUserSaved')
    tableData.value = res.sort((a, b) => a.index - b.index)
  } catch (e) {
    tableData.value = []
  }
  tableLoading.value = false
}

loadList()

</script>

<style scoped lang="scss">

.page-container {
  margin: 30px 35px 0px;
}

.table-wrapper {
  height: calc(100vh - 160px);
}

.button-wrapper {
  margin-bottom: 20px;

  .button {
    width: 160px;
  }

}

.SendButton-wrapper {
  display: flex;
  align-content: flex-end;
  height: calc(100vh - 380px);
}

</style>