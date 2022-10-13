<template>
  <el-dialog v-model="visible.visible" title="Add User">
    <el-form :model="form">
      <el-form-item label="User ID" :label-width="formLabelWidth">
        <el-input v-model="form.userID" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Password" :label-width="formLabelWidth">
        <el-input v-model="form.password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Email" :label-width="formLabelWidth">
        <el-input v-model="form.email" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Name" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>

      <el-form-item label="Groups" :label-width="formLabelWidth">
        <el-select multiple v-model="form.groups" placeholder="Please select the user groups">
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
        <el-button type="primary" @click="AddUserEvent">Add</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {get, post} from "@/utils/request";
import {ElMessage} from 'element-plus'
import { reactive, ref } from 'vue'

type Props = {
  visible: any
}
const props = defineProps<Props>()
const emit = defineEmits(['refreshUserTable'])

const refreshUserTable = () => {
  emit('refreshUserTable')
}

const formLabelWidth = '140px'

type User = {
  userID: string
  password: string
  email: string
  name: string
  groups: Array<string>
}


type Group = {
  groupID: number
  groupName: string
}
const groups = ref([] as Group[])
const form = reactive({} as User)

get('api/groups').then((res) => {
  console.log(res)
  groups.value = res;
})

const AddUserEvent = () => {
  post('api/users', form).then((res) => {
    ElMessage({
      message: 'Add user successfully',
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