<template>
  <el-dialog v-model="visibleSync" title="Import Course Template">
    <el-alert :closable="false" type="success" :title="'Import a course template into the semester: '+termName" class="termAlert" effect="dark"/>
    <el-upload
        :action="baseURL + '/api/uploadCourse/' + term"
        class="upload-demo"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        :headers="header"
        ref="upload"
        :auto-upload="false"
        :limit="1"
        :on-exceed="handleExceed"
        :on-success="handleSuccess"
        :on-error="handleError"
        v-model:file-list="file"
        drag>
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">
        Drop file here or <em>click to upload</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">
          xlsx, xls and csv files are supported.
        </div>
      </template>
    </el-upload>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visibleSync = false">Cancel</el-button>
        <el-button type="primary" @click="uploadEvent" :loading="uploadLoading"
        >Import</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>


<script setup lang="ts">
import {computed, watch, ref} from "vue";
import { UploadFilled } from '@element-plus/icons-vue'
import {
  ElMessage,
  UploadProps,
  UploadUserFile,
  UploadInstance,
  UploadRawFile,
  genFileId,
  ElNotification
} from "element-plus";
import {baseURL} from '@/utils/request';
const props = defineProps(['importVisible', 'term', 'termName'])
const emit = defineEmits(['update:importVisible', 'update:term', 'update:termName', 'getCourseList'])
const file = ref<UploadUserFile[]>([])
const header = ref({'Authorization': 'Bearer ' + localStorage.getItem('mtms_token')})
const upload = ref<UploadInstance>()

const getCourseList = () => {
  emit('getCourseList')
}
const visibleSync = computed({
  get() {
    return props.importVisible as boolean
  },
  set(val) {
    emit('update:importVisible', val)
  }
})

const termNameSync = computed({
  get() {
    return props.termName as string
  },
  set(val) {
    emit('update:termName', val)
  }
})


const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}


const uploadLoading = ref(false)

const uploadEvent = () => {
  uploadLoading.value = true
  if (file.value.length === 0) {
    ElMessage.warning('Please select a file.')
    uploadLoading.value = false
    return
  }
  upload.value!.submit()

}

const handleSuccess = (response: any, file: UploadUserFile) => {
    let Notimessage = '';
    response['message'].forEach((e: String) => {
      Notimessage += `<p>${e}</p>`
    })
    getCourseList()
    ElNotification({
      title: 'Import Course Template Log',
      dangerouslyUseHTMLString: true,
      message: Notimessage,
      type: 'success',
      duration: 10000
    })
    upload.value!.clearFiles()
    visibleSync.value = false
    uploadLoading.value = false

}

const handleError = (err: Error, file: UploadUserFile) => {
  getCourseList()
  ElMessage({
    message: err.message,
    type: 'error'
  })
  upload.value!.clearFiles()
  uploadLoading.value = false
}


</script>

<style scoped>

.termAlert{
  margin-bottom: 20px;
  font-size: 10px;
}



</style>