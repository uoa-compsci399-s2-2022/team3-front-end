<template>
  <el-dialog v-model="visible.visible" title="Edit User">
    <el-form :model="form">
      <el-form-item label="Name" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="AUID" :label-width="formLabelWidth">
        <el-input v-model="form.auid" autocomplete="off" />
      </el-form-item>
      <el-form-item label="UPI" :label-width="formLabelWidth">
        <el-input v-model="form.upi" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Email" :label-width="formLabelWidth">
        <el-input v-model="form.email" autocomplete="off" />
      </el-form-item>
      <el-form-item label="EnrollDetails" :label-width="formLabelWidth">
        <el-input v-model="form.enrolDetails" autocomplete="off" />
      </el-form-item>
      <el-form-item label="StudentDegree" :label-width="formLabelWidth">
        <el-select v-model="form.studentDegree" placeholder="Please select the user Degree">
          <el-option label="Undergraduate" value = "Undergraduate"></el-option>
          <el-option label="Postgraduate" value = "Postgraduate"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="Groups" :label-width="formLabelWidth">
        <el-select multiple v-model="editgroups.groups" placeholder="Please select the user groups">
          <el-option
              v-for="g in groups"
              :key="g.groupName"
              :label="g.groupName"
              :value="g.groupName"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible.visible = false">Cancel</el-button>
        <el-button type="primary" @click="EditUserEvent">Submit</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {get, post, put} from "@/utils/request";
import {ElMessage} from 'element-plus'
import { reactive, ref } from 'vue'
import {stringify} from "querystring";
import router from "@/router";

type User = {
  id: string
  email: string
  name: string
  groups: Array<string>
  createDateTime: string
}
type Props = {
  visible: any
  currentUser : User
}
const props = defineProps<Props>()
const emit = defineEmits(['refreshUserTable'])

const refreshUserTable = () => {
  emit('refreshUserTable')
}

const formLabelWidth = '140px'

type editUser = {
  email: string
  name: string
  upi: string
  auid: string
  enrolDetails: string
  studentDegree: string
  groups: Array<string>
}

type Group = {
  groupID: number
  groupName: string
}
type editGroup = {
  groups: Array<string>
}
const groups = ref([] as Group[])
const form = reactive({} as editUser)
const usercurrentinfor = ref({} as editUser)
const editgroups = reactive({} as editGroup)


get('api/UserProfile/'+ props.currentUser.id).then((res) => {
  usercurrentinfor.value.name = res.name
  usercurrentinfor.value.auid =res.auid
  usercurrentinfor.value.upi = res.upi
  usercurrentinfor.value.email = res.email
  usercurrentinfor.value.enrolDetails = res.enrolDetails
  usercurrentinfor.value.studentDegree = res.studentDegree
  usercurrentinfor.value.groups=res.groups

  form.name = res.name
  form.auid =res.auid
  form.upi = res.upi
  form.email = res.email
  form.enrolDetails = res.enrolDetails
  form.studentDegree = res.studentDegree
  editgroups.groups=res.groups
}).catch(err => console.log(err))

get('api/groups').then((res) => {
  console.log(res)
  groups.value = res;
})

const EditUserEvent = () => {
  put('api/UserProfile/'+props.currentUser.id, {data: form}).then((res) => {
    ElMessage({
      message: 'Edit user successfully',
      type: 'success'
    })
    props.visible.visible  = false
    refreshUserTable()

  }).catch((err) => {
    ElMessage({
      message: err.response.data['message'],
      type: 'error'
    })
  })
  put('api/userGroupManagement/'+props.currentUser.id, {data: editgroups}).then((res) => {
    ElMessage({
      message: 'Edit user groups successfully',
      type: 'success'
    })
    props.visible.visible  = false
    refreshUserTable()

  }).catch((err) => {
    ElMessage({
      message: err.response.data['message'],
      type: 'error'
    })
  })
}


</script>

<style scoped>

</style>