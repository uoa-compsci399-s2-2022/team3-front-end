<template>
  <el-dialog v-model="visibleSync" title="Import Course Template">
    <el-alert :closable="false" type="success" :title="'Import a course template into the semester: '+termName" class="termAlert" effect="dark"/>
    <el-upload
        :action="'/api/api/uploadCourse/' + term"
        class="upload-demo"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        :headers="header"
        ref="upload"
        :auto-upload="false"
        :limit="1"
        :on-exceed="handleExceed"
        :on-success="handleSuccess"
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
        <el-button type="primary" @click="uploadEvent"
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
const props = defineProps(['importVisible', 'term', 'termName'])
const emit = defineEmits(['update:importVisible', 'update:term', 'update:termName'])
const file = ref<UploadUserFile[]>([])
const header = ref({'Authorization': 'Bearer ' + localStorage.getItem('mtms_token')})
const upload = ref<UploadInstance>()
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

const uploadEvent = () => {
  if (file.value.length === 0) {
    ElMessage.warning('Please select a file.')
    return
  }
  upload.value!.submit()
}

const handleSuccess = (response: any, file: UploadUserFile) => {
    let Notimessage = '';

    console.log(response)
    response['message'].forEach((e: String) => {
      Notimessage += `<p>${e}</p>`
    })
    ElNotification({
      title: 'Import Course Template Log',
      dangerouslyUseHTMLString: true,
      message: Notimessage,
      type: 'success',
      duration: 10000
    })
    upload.value!.clearFiles()
    visibleSync.value = false
}


</script>

<style scoped>

.termAlert{
  margin-bottom: 20px;
  font-size: 10px;
}



</style>