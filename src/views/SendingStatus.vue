<template>
  <div class="page-container">
    <div class="header-button">
      <el-popconfirm title="Are you sure to delete all sending email?" width="150" @confirm="deleteAllSendingEmail">
        <template #reference>
          <el-button type="danger" plain> Delete All Sending Email
          </el-button>
        </template>
      </el-popconfirm>
    </div>
    <el-table :data="stateSend" style="width: 100%" lazy>
      <el-table-column type="expand">
        <template #default="props">
          <el-descriptions
              border
              class="email-descriptions"
          >
            <el-descriptions-item label="Email Category">
              {{ props.row.category }}
            </el-descriptions-item>
            <el-descriptions-item label="Error Message" v-if="props.row.status === 'failed'"
                                  style="margin: 0; padding: 0">
              <codemirror style="max-width: 750px; padding: 0; margin: 0" v-model="props.row.error_message" disabled/>
            </el-descriptions-item>
            <el-descriptions-item label="Receiver Name">
              {{ props.row.receiver_name }}
            </el-descriptions-item>
            <el-descriptions-item label="Receiver Groups">
              {{ props.row.receiver_groups }}
            </el-descriptions-item>
            <el-descriptions-item label="Receiver UPI">
              {{ props.row.receiver_upi }}
            </el-descriptions-item>
            <el-descriptions-item label="Receiver AUID">
              {{ props.row.receiver_auid }}
            </el-descriptions-item>
            <el-descriptions-item label="Celery Task ID">
              {{ props.row.task_id }}
            </el-descriptions-item>
            <el-descriptions-item label="Celery Status">
              {{ props.row.celery_task_status }}
            </el-descriptions-item>
          </el-descriptions>
        </template>
      </el-table-column>
      <el-table-column prop="emailDeliveryStatusID" label="Email ID" width="120"/>
      <el-table-column prop="status" label="Status" width="120" :filters="[
        { text: 'sent', value: 'sent' },
        { text: 'sending', value: 'sending' },
        { text: 'failed', value: 'failed' },
      ]" :filter-method="filterHandler">
        <template #default="scope">
          <el-tag
              :type="getStatusTag(scope.row.status)"
              disable-transitions
          >{{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="receiver_user_id" label="Receiver UserID" width="180"/>
      <el-table-column prop="email" label="Email"/>
      <el-table-column prop="category" label="Category" :filters="[
        { text: 'Invite User', value: 'invite_user' },
        { text: 'Application Result', value: 'application_result' },
      ]" :filter-method="filterHandler"/>
      <el-table-column label="Send Date">
        <template #default="scope">
          {{ datetimeFormat(scope.row.createdDateTime) }}
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script setup lang="ts">

import {useAsyncState} from "@vueuse/core";
import {get} from "@/utils/request";
import {ElMessage} from "element-plus";
import {TableColumnCtx} from "element-plus/es/components/table/src/table-column/defaults";
import {EditorState} from '@codemirror/state'
import {Codemirror} from "vue-codemirror";
import {datetimeFormat} from "@/utils/datetimeFormat";

const statusTag = {
  'sending': '',
  'sent': 'success',
  'failed': 'danger',
}

const getStatusTag = (status: string) => {

  let result = Object.keys(statusTag).find((key) => {
    return key === status
  })
  return result ? statusTag[result] : 'warning'
}

interface EmailSendList {
  [key: string]: any;

  emailDeliveryStatusID: number
  receiver_user_id: string
  sender_user_id: string
  email: string
  category: string
  status: string
  createdDateTime?: string
  error_message?: string
  receiver_groups?: Array<any>
  receiver_name?: string
  receiver_upi?: string
  receiver_auid?: string
  task_id?: string
  celery_task_status: string
}

const {isLoading: isLoadingSend, state: stateSend, isReady: isReadySend, execute: executeSend} = useAsyncState(
    (args) => {
      return get('/api/sendingStatus');
    },
    [],
    {
      resetOnExecute: false,
    },
)


const deleteAllSendingEmail = () => {
  get('/api/deleteEmailSending/all').then(() => {
    ElMessage({
      type: 'success',
      message: 'Delete All Sending Email Successfully!'
    })
  }).catch((err) => {
    ElMessage({
      type: 'error',
      message: err.response.data.message
    })
  })
}

const filterHandler = (
    value: string,
    row: EmailSendList,
    column: TableColumnCtx<EmailSendList>
) => {
  const property = column['property']
  return row[property] === value
}


</script>

<style scoped>
.page-container {
  margin: 15px 30px 15px;
}

.email-descriptions {
  margin: 15px 15px;
}

.header-button {
  display: flex;
  justify-content: end;
  margin-bottom: 5px;
}


</style>