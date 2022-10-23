<template>

  <div class="page-container">
    <el-row class="hidden-md-and-up" justify="center" style="margin-bottom: 7px">
      <el-button class="button_md_down" type="warning" @click="saveEvent">
        <font-awesome-icon icon="fa-solid fa-cloud-arrow-up"/> &nbsp; Save
      </el-button>
      <el-button class="button_md_down" type="primary" :icon="Plus" @click="addRow(null)">Row</el-button>
      <el-button class="button_md_down" :icon="DeleteFilled" type="danger" @click="removeButtonClickEvent">Delete
      </el-button>
      <el-button class="button_md_down" type="success" :icon="Promotion" @click="send">Send</el-button>
    </el-row>


    <el-row>
      <el-col :span="24" :md="20">
        <div class="table-wrapper">
          <vxe-table
              ref="tableRef"
              border
              keep-source
              height="100%"
              :loading="tableLoading"
              :loading-config="{icon: 'vxe-icon-indicator roll', text: 'Loading...'}"
              :keyboard-config="{isArrow: true, isDel: true, isEnter: true, isTab: true, isEdit: true, isChecked: true}"
              :mouse-config="{selected: true}"
              :data="tableData.value"
              :column-config="{resizable: true}"
              :edit-config="{trigger: 'click', mode: 'row', showStatus: true}"
              :sort-config="{trigger: 'cell', defaultSort: {field: 'age', order: 'desc'}, orders: ['desc', 'asc', null]}"
              @edit-closed="editClosedEvent">
            <vxe-column type="checkbox" width="40"></vxe-column>
            <vxe-column type="seq" width="40"></vxe-column>
            <vxe-column field="userID" title="UserID (UPI)" :edit-render="{autofocus: '.vxe-input--inner'}">
              <template #edit="{ row }">
                <vxe-input v-model="row.userID"></vxe-input>
              </template>
            </vxe-column>
            <vxe-column field="email" title="Email" :edit-render="{autofocus: '.vxe-input--inner'}">
              <template #edit="{ row }">
                <vxe-input v-model="row.email"></vxe-input>
              </template>
            </vxe-column>
            <vxe-column field="name" title="Name" :edit-render="{autofocus: '.vxe-input--inner'}">
              <template #edit="{ row }">
                <vxe-input v-model="row.name"></vxe-input>
              </template>
            </vxe-column>
            <vxe-column field="groups" title="Groups" :edit-render="{autofocus: '.vxe-input--inner'}">
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
      <el-col :span="0" :md="4" class="button-col">
        <el-row justify="center" class="button-wrapper">
          <el-button class="button" type="warning" @click="saveEvent">
            <font-awesome-icon icon="fa-solid fa-cloud-arrow-up"/> &nbsp; Save
          </el-button>
        </el-row>
        <el-row justify="center" class="button-wrapper">
          <el-button class="button" type="primary" :icon="Plus" @click="addRow(null)" :loading="tableLoading">Add Row</el-button>
        </el-row>
        <el-row justify="center" class="button-wrapper">
          <el-button class="button" type="primary" :icon="Plus" @click="addRow('student')" :loading="tableLoading">Student</el-button>
        </el-row>
        <el-row justify="center" class="button-wrapper">
          <el-button class="button" type="primary" :icon="Plus" @click="addRow('courseCoordinator')" :loading="tableLoading">Course Coord</el-button>
        </el-row>
        <el-row justify="center" class="button-wrapper">
          <el-button class="button" :icon="DeleteFilled" type="danger" @click="removeButtonClickEvent" :loading="tableLoading">Delete
          </el-button>
        </el-row>
        <el-row justify="center" class="SendButton-wrapper">
          <el-button class="button" type="success" :icon="Promotion" size="large" @click="send" :loading="tableLoading">Send</el-button>
        </el-row>
      </el-col>
    </el-row>
  </div>


  <el-dialog
      v-model="deleteDialogVisible"
      title="Delete Confirmation"
      width="30%"
  >
    <p>Are you sure to delete the selected row?</p>
    <p>If you choose <strong style="font-weight: bold">Confirm & Save</strong> will delete these selected columns on the
      server (that is, the operation is irreversible)!</p>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">Cancel</el-button>
        <el-button type="danger"
                   @click="deleteSaveEvent">Confirm & Save</el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script setup lang="ts">
import {Plus, Promotion, DocumentChecked, DeleteFilled} from "@element-plus/icons-vue";
import {VXETable, VxeTableInstance, VxeTableEvents} from "vxe-table";
import {ref, reactive, toRefs, onBeforeMount} from 'vue'
import {get, post} from "@/utils/request";
import {ElMessage, ElMessageBox} from "element-plus";
import {useSendEmailStore} from "@/store/modules/sendEmail/sendEmail"
import 'element-plus/theme-chalk/display.css';


const sendEmail = useSendEmailStore()


type InviteUser = {
  index: number,
  userID: string
  email: string,
  name: string,
  groups: Array<string>
}
type Group = {
  groupID: number
  groupName: string
}


const tableRef = ref<VxeTableInstance>({} as VxeTableInstance)
const tableLoading = ref(false)
const tableData = reactive({
  value: [] as InviteUser[]
})
const groups = ref([] as Group[])
const deleteDialogVisible = ref(false)

const editClosedEvent: VxeTableEvents.EditClosed = ({row, column}) => {
  const $table = tableRef.value
  if ($table.isUpdateByRow(row)) {
    autoSaveUpdateEvent()
  }
}

const addRow = async (group: string | null) => {
  tableLoading.value = true
  try {
    const res: InviteUser[] = await get('api/inviteUserSaved')
    tableData.value = []
    tableData.value = res.sort((a, b) => b.index - a.index)
  } catch (e) {
    tableData.value = []
  }
  let user: InviteUser;
  const $table = tableRef.value;
  const indexList = $table.data!.map(i => i.index)
  let indexNum: number = 0;
  if (tableData.value.length == 0) {
    indexNum = 1
  } else {
    indexNum = Math.max(...indexList) + 1
  }
  if (group === null) {
    user = {
      index: indexNum,
      userID: '',
      email: '',
      name: '',
      groups: []
    }
  } else {
    user = {
      index: indexNum,
      userID: '',
      email: '',
      name: '',
      groups: [group]
    }
  }
  await $table.insertAt(user, null)
  const {insertRecords} = $table.getRecordset()
  const errMap = await $table?.validate()
  if (errMap) {
    return
  }
  const body = {insertRecords: insertRecords, removeRecords: [], updateRecords: []}
  await post('api/inviteUserSaved', body).then(
      (res) => {
        ElMessage({
          message: 'Save success',
          type: 'success',
          grouping: true
        })
        loadList().then(() => {
          $table.setEditCell($table.data[0], 'userID')
        })
      }).catch((err) => {
    ElMessage({
      message: err.response.data['message'],
      type: 'error',
      grouping: true
    })
    loadList()
  })
}


const send = async () => {
  await saveEvent()
  const $table = tableRef.value
  if ($table.data!.length === 0) {
    ElMessage.warning('Please add users who need to be invited!')
    return
  }
  if (sendEmail.status !== '') {
    ElMessage({
      message: 'Please wait for the previous email to be sent!',
      type: 'warning'
    })
    return
  }
  sendEmail.status = 'processing'

  get('api/inviteUser', null, 0).then((res) => {
    console.log(res)
    ElMessage({
      message: '',
      type: 'success',
      grouping: true
    })
    sendEmail.status = 'success'
  }).catch((err) => {
    console.log(err)
    ElMessage({
      message: err.response.data['message'],
      type: 'error',
      grouping: true
    })
    sendEmail.status = 'error'
  })
}


const autoSaveUpdateEvent = async () => {
  const $table = tableRef.value
  console.log($table.getRecordset())
  const {updateRecords} = $table.getRecordset()
  const errMap = await $table?.validate()
  if (errMap) {
    return
  }
  try {
    const body = {insertRecords: [], removeRecords: [], updateRecords}
    await post('api/inviteUserSaved', body).then(
        (res) => {
          ElMessage({
            message: 'Save success',
            type: 'success',
            grouping: true
          })
          updateRecords.forEach((item) => {
            $table.reloadRow(item)
          })
        }).catch((err) => {
      ElMessage({
        message: err.response.data['message'],
        type: 'error'
      })

    })
  } catch (e: any) {
    if (e && e.message) {
      ElMessage({
        message: e.message,
        type: 'error'
      })
    }
  }
}

const saveEvent = async () => {
  const $table = tableRef.value
  console.log($table.getRecordset())
  const {insertRecords, removeRecords, updateRecords} = $table.getRecordset()
  // if (insertRecords.length <= 0 && removeRecords.length <= 0 && updateRecords.length <= 0) {
  //   ElMessage({
  //     message: 'Save: No changes',
  //     type: 'warning'
  //   })
  //   return false
  // }
  const errMap = await $table?.validate()
  if (errMap) {
    return false
  }
  tableLoading.value = true
  try {
    const body = {insertRecords, removeRecords, updateRecords}
    await post('api/inviteUserSaved', body).then(
        (res) => {
          ElMessage({
            message: 'Save success',
            type: 'success',
            grouping: true
          })
        }).catch((err) => {
      ElMessage({
        message: err.response.data['message'],
        type: 'error'
      })
    })
    await loadList()
  } catch (e: any) {
    if (e && e.message) {
      ElMessage({
        message: e.message,
        type: 'error'
      })
    }
  }
  tableLoading.value = false
}


const removeButtonClickEvent = () => {
  const $table = tableRef.value
  if ($table.getCheckboxRecords().length <= 0) {
    ElMessage({
      message: 'Please select the row to delete',
      type: 'warning',
      grouping: true
    })
    return
  }
  deleteDialogVisible.value = true
}


const removeEvent = async () => {
  const $table = tableRef.value
  if ($table.getCheckboxRecords().length <= 0) {
    ElMessage({
      message: 'Please select the row to delete',
      type: 'warning',
      grouping: true
    })
    return
  }
  tableLoading.value = true
  await $table?.removeCheckboxRow()
}


const loadList = async () => {
  tableLoading.value = true
  try {
    const res: InviteUser[] = await get('api/inviteUserSaved')
    tableData.value = []
    tableData.value = res.sort((a, b) => b.index - a.index)
  } catch (e) {
    tableData.value = []
  }
  tableLoading.value = false
}


const deleteSaveEvent = async () => {
  await removeEvent();
  await saveEvent();
  deleteDialogVisible.value = false;
}


onBeforeMount(() => {
  tableData.value = []
  get('api/inviteableGroups').then((res) => {
    tableLoading.value = true
    groups.value = res;
    loadList()
  })
})


</script>

<style scoped lang="scss">

.page-container {
  margin: 20px 20px 0 20px;
}

.table-wrapper {
  height: calc(100vh - 148px);
}

@media screen and (max-width: 992px) {
  .table-wrapper {
    height: calc(100vh - 188px);
  }
}

.button-wrapper {
  margin-bottom: 20px;

  .button {
    width: 140px;
  }
}

.button_md_down {
  width: 100px;
}

.SendButton-wrapper {
  display: flex;
  align-content: flex-end;
  height: calc(100vh - 440px);
}

</style>